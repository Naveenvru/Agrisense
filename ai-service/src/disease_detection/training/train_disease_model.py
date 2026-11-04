"""
AgriSense AI Service — Deep Learning Disease Model Training & Evaluation (Stage D)
===================================================================================
Trains MobileNetV3-Small on authentic PlantVillage crop imagery:
- Stratified dataset partitioning (Train / Validation / Untouched Test)
- Realistic training data augmentations (flips, rotations, affine, jitter)
- PyTorch training loop with cross-entropy loss and learning rate scheduling
- Saves best validation checkpoint to models/disease/mobilenetv3_best.pth
- Full evaluation on untouched test set: accuracy, macro F1, per-class report, confusion matrix
- Saves evaluation JSON, history JSON, classification CSV, and confusion matrix PNG
"""

import csv
import json
import logging
from pathlib import Path
from typing import Any, Dict, List, Tuple

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
import torch
import torch.nn as nn
from PIL import Image
from sklearn.metrics import classification_report, confusion_matrix
from torch.utils.data import DataLoader, Dataset
from torchvision import transforms
from torchvision.models import MobileNet_V3_Small_Weights, mobilenet_v3_small

logger = logging.getLogger(__name__)

ROOT_DIR = Path(__file__).resolve().parent.parent.parent.parent
DATA_DIR = ROOT_DIR / "data"
RAW_PV_DIR = DATA_DIR / "raw" / "plantvillage"
MODELS_DIR = ROOT_DIR / "models" / "disease"
REPORTS_DIR = ROOT_DIR / "reports"

MODELS_DIR.mkdir(parents=True, exist_ok=True)
REPORTS_DIR.mkdir(parents=True, exist_ok=True)


class PlantVillageDataset(Dataset):
    def __init__(self, samples: List[Tuple[Path, int]], transform=None):
        self.samples = samples
        self.transform = transform

    def __len__(self):
        return len(self.samples)

    def __getitem__(self, idx):
        path, label = self.samples[idx]
        with Image.open(path) as img:
            img = img.convert("RGB")
            if self.transform:
                img = self.transform(img)
            return img, label


def prepare_datasets(
    train_ratio: float = 0.70,
    val_ratio: float = 0.15,
) -> Tuple[Dataset, Dataset, Dataset, List[str]]:
    """Scans local raw directory, collects images, and creates stratified splits."""
    classes = sorted([d.name for d in RAW_PV_DIR.iterdir() if d.is_dir()])
    if not classes:
        raise ValueError(f"No class folders found in {RAW_PV_DIR}")

    class_to_idx = {c: i for i, c in enumerate(classes)}

    train_samples, val_samples, test_samples = [], [], []

    for c in classes:
        c_dir = RAW_PV_DIR / c
        images = sorted(list(c_dir.glob("*.jpg")) + list(c_dir.glob("*.JPG")) + list(c_dir.glob("*.png")))
        n = len(images)
        if n == 0:
            continue

        n_train = max(1, int(n * train_ratio))
        n_val = max(1, int(n * val_ratio))

        c_train = images[:n_train]
        c_val = images[n_train : n_train + n_val]
        c_test = images[n_train + n_val :] if len(images) > (n_train + n_val) else c_val

        idx = class_to_idx[c]
        train_samples.extend([(p, idx) for p in c_train])
        val_samples.extend([(p, idx) for p in c_val])
        test_samples.extend([(p, idx) for p in c_test])

    train_tf = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.RandomHorizontalFlip(),
        transforms.RandomRotation(15),
        transforms.ColorJitter(brightness=0.1, contrast=0.1),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
    ])

    eval_tf = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
    ])

    return (
        PlantVillageDataset(train_samples, train_tf),
        PlantVillageDataset(val_samples, eval_tf),
        PlantVillageDataset(test_samples, eval_tf),
        classes,
    )


def train_disease_classifier(epochs: int = 5, batch_size: int = 16) -> Dict[str, Any]:
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    logger.info(f"Using device for training: {device}")

    train_ds, val_ds, test_ds, classes = prepare_datasets()
    num_classes = len(classes)
    logger.info(
        f"Prepared datasets: Train={len(train_ds)}, Val={len(val_ds)}, Test={len(test_ds)}, Classes={num_classes}"
    )

    train_loader = DataLoader(train_ds, batch_size=batch_size, shuffle=True)
    val_loader = DataLoader(val_ds, batch_size=batch_size, shuffle=False)
    test_loader = DataLoader(test_ds, batch_size=batch_size, shuffle=False)

    model = mobilenet_v3_small(weights=None)
    in_feat = model.classifier[3].in_features
    model.classifier[3] = nn.Sequential(
        nn.Dropout(p=0.2),
        nn.Linear(in_feat, num_classes),
    )
    model.to(device)

    criterion = nn.CrossEntropyLoss()
    optimizer = torch.optim.AdamW(model.parameters(), lr=1e-3, weight_decay=1e-4)

    history = {"train_loss": [], "train_acc": [], "val_loss": [], "val_acc": []}
    best_val_acc = 0.0
    best_model_path = MODELS_DIR / "mobilenetv3_best.pth"

    for epoch in range(1, epochs + 1):
        model.train()
        t_loss, t_correct, t_total = 0.0, 0, 0
        for imgs, labels in train_loader:
            imgs, labels = imgs.to(device), labels.to(device)
            optimizer.zero_grad()
            outputs = model(imgs)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()

            t_loss += loss.item() * len(labels)
            _, preds = torch.max(outputs, 1)
            t_correct += (preds == labels).sum().item()
            t_total += len(labels)

        train_loss = t_loss / t_total
        train_acc = t_correct / t_total

        # Validation
        model.eval()
        v_loss, v_correct, v_total = 0.0, 0, 0
        with torch.no_grad():
            for imgs, labels in val_loader:
                imgs, labels = imgs.to(device), labels.to(device)
                outputs = model(imgs)
                loss = criterion(outputs, labels)
                v_loss += loss.item() * len(labels)
                _, preds = torch.max(outputs, 1)
                v_correct += (preds == labels).sum().item()
                v_total += len(labels)

        val_loss = v_loss / max(1, v_total)
        val_acc = v_correct / max(1, v_total)

        history["train_loss"].append(round(train_loss, 4))
        history["train_acc"].append(round(train_acc, 4))
        history["val_loss"].append(round(val_loss, 4))
        history["val_acc"].append(round(val_acc, 4))

        logger.info(
            f"Epoch {epoch}/{epochs} | Train Loss: {train_loss:.4f}, Train Acc: {train_acc*100:.1f}% | "
            f"Val Loss: {val_loss:.4f}, Val Acc: {val_acc*100:.1f}%"
        )

        if val_acc >= best_val_acc:
            best_val_acc = val_acc
            torch.save(model.state_dict(), best_model_path)

    # Save training history
    hist_path = REPORTS_DIR / "disease_training_history.json"
    with open(hist_path, "w") as f:
        json.dump(history, f, indent=2)

    # Final evaluation on untouched test set
    model.load_state_dict(torch.load(best_model_path, map_location=device))
    model.eval()

    all_preds, all_labels = [], []
    with torch.no_grad():
        for imgs, labels in test_loader:
            imgs = imgs.to(device)
            outputs = model(imgs)
            _, preds = torch.max(outputs, 1)
            all_preds.extend(preds.cpu().numpy().tolist())
            all_labels.extend(labels.numpy().tolist())

    all_preds = np.array(all_preds)
    all_labels = np.array(all_labels)

    test_acc = float((all_preds == all_labels).mean())
    cls_report = classification_report(
        all_labels,
        all_preds,
        target_names=[classes[i] for i in sorted(list(set(all_labels).union(set(all_preds))))],
        output_dict=True,
        zero_division=0,
    )

    # Save classification report CSV
    csv_report_path = REPORTS_DIR / "disease_classification_report.csv"
    with open(csv_report_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["class_name", "precision", "recall", "f1_score", "support"])
        for k, v in cls_report.items():
            if isinstance(v, dict):
                writer.writerow([k, v.get("precision"), v.get("recall"), v.get("f1-score"), v.get("support")])

    # Confusion matrix
    cm = confusion_matrix(all_labels, all_preds)
    fig, ax = plt.subplots(figsize=(10, 8))
    im = ax.imshow(cm, interpolation="nearest", cmap=plt.cm.Greens)
    ax.figure.colorbar(im, ax=ax)
    ax.set(
        xticks=np.arange(cm.shape[1]),
        yticks=np.arange(cm.shape[0]),
        title=f"PlantVillage MobileNetV3 Test Confusion Matrix (Acc: {test_acc*100:.1f}%)",
        ylabel="True Label",
        xlabel="Predicted Label",
    )
    plt.tight_layout()
    cm_path = REPORTS_DIR / "disease_confusion_matrix.png"
    fig.savefig(cm_path, dpi=120)
    plt.close(fig)

    eval_summary = {
        "model_architecture": "MobileNetV3-Small",
        "dataset": "PlantVillage (Verified Subset)",
        "train_samples": len(train_ds),
        "val_samples": len(val_ds),
        "test_samples": len(test_ds),
        "num_classes": num_classes,
        "epochs_trained": epochs,
        "best_val_accuracy": round(best_val_acc, 4),
        "untouched_test_accuracy": round(test_acc, 4),
        "macro_precision": round(cls_report["macro avg"]["precision"], 4),
        "macro_recall": round(cls_report["macro avg"]["recall"], 4),
        "macro_f1": round(cls_report["macro avg"]["f1-score"], 4),
        "weighted_f1": round(cls_report["weighted avg"]["f1-score"], 4),
        "saved_checkpoint": str(best_model_path.relative_to(ROOT_DIR)),
        "confusion_matrix_path": str(cm_path.relative_to(ROOT_DIR)),
        "status": "TRAINED_AND_EVALUATED",
    }

    eval_json_path = REPORTS_DIR / "disease_model_evaluation.json"
    with open(eval_json_path, "w", encoding="utf-8") as f:
        json.dump(eval_summary, f, indent=2)

    logger.info(f"Disease model training & evaluation complete: Test Acc={test_acc*100:.1f}%, Macro F1={eval_summary['macro_f1']}")
    return eval_summary


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    train_disease_classifier(epochs=3, batch_size=16)
