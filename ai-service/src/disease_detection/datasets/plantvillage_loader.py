"""
AgriSense AI Service — PlantVillage Dataset Loader & Catalog (Stage 8)
======================================================================
Catalogs and manages verified PlantVillage crop disease image collections:
- Scans raw image directories
- Maps directory structures to canonical crop and disease labels
- Separates Healthy from Pathogenic classes
- Generates data/metadata/plantvillage_manifest.json
"""

import json
import logging
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

logger = logging.getLogger(__name__)

# Complete Canonical PlantVillage 38-Class Reference Catalog
PLANTVILLAGE_CLASSES: Dict[str, Dict[str, str]] = {
    "Apple___Apple_scab": {"crop": "Apple", "condition": "Apple Scab", "is_healthy": False},
    "Apple___Black_rot": {"crop": "Apple", "condition": "Black Rot", "is_healthy": False},
    "Apple___Cedar_apple_rust": {"crop": "Apple", "condition": "Cedar Apple Rust", "is_healthy": False},
    "Apple___healthy": {"crop": "Apple", "condition": "Healthy", "is_healthy": True},
    "Blueberry___healthy": {"crop": "Blueberry", "condition": "Healthy", "is_healthy": True},
    "Cherry_(including_sour)___Powdery_mildew": {"crop": "Cherry", "condition": "Powdery Mildew", "is_healthy": False},
    "Cherry_(including_sour)___healthy": {"crop": "Cherry", "condition": "Healthy", "is_healthy": True},
    "Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot": {"crop": "Corn (Maize)", "condition": "Cercospora Gray Leaf Spot", "is_healthy": False},
    "Corn_(maize)___Common_rust_": {"crop": "Corn (Maize)", "condition": "Common Rust", "is_healthy": False},
    "Corn_(maize)___Northern_Leaf_Blight": {"crop": "Corn (Maize)", "condition": "Northern Leaf Blight", "is_healthy": False},
    "Corn_(maize)___healthy": {"crop": "Corn (Maize)", "condition": "Healthy", "is_healthy": True},
    "Grape___Black_rot": {"crop": "Grape", "condition": "Black Rot", "is_healthy": False},
    "Grape___Esca_(Black_Measles)": {"crop": "Grape", "condition": "Esca (Black Measles)", "is_healthy": False},
    "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)": {"crop": "Grape", "condition": "Leaf Blight", "is_healthy": False},
    "Grape___healthy": {"crop": "Grape", "condition": "Healthy", "is_healthy": True},
    "Orange___Haunglongbing_(Citrus_greening)": {"crop": "Orange", "condition": "Citrus Greening (HLB)", "is_healthy": False},
    "Peach___Bacterial_spot": {"crop": "Peach", "condition": "Bacterial Spot", "is_healthy": False},
    "Peach___healthy": {"crop": "Peach", "condition": "Healthy", "is_healthy": True},
    "Pepper,_bell___Bacterial_spot": {"crop": "Pepper (Bell)", "condition": "Bacterial Spot", "is_healthy": False},
    "Pepper,_bell___healthy": {"crop": "Pepper (Bell)", "condition": "Healthy", "is_healthy": True},
    "Potato___Early_blight": {"crop": "Potato", "condition": "Early Blight", "is_healthy": False},
    "Potato___Late_blight": {"crop": "Potato", "condition": "Late Blight", "is_healthy": False},
    "Potato___healthy": {"crop": "Potato", "condition": "Healthy", "is_healthy": True},
    "Raspberry___healthy": {"crop": "Raspberry", "condition": "Healthy", "is_healthy": True},
    "Soybean___healthy": {"crop": "Soybean", "condition": "Healthy", "is_healthy": True},
    "Squash___Powdery_mildew": {"crop": "Squash", "condition": "Powdery Mildew", "is_healthy": False},
    "Strawberry___Leaf_scorch": {"crop": "Strawberry", "condition": "Leaf Scorch", "is_healthy": False},
    "Strawberry___healthy": {"crop": "Strawberry", "condition": "Healthy", "is_healthy": True},
    "Tomato___Bacterial_spot": {"crop": "Tomato", "condition": "Bacterial Spot", "is_healthy": False},
    "Tomato___Early_blight": {"crop": "Tomato", "condition": "Early Blight", "is_healthy": False},
    "Tomato___Late_blight": {"crop": "Tomato", "condition": "Late Blight", "is_healthy": False},
    "Tomato___Leaf_Mold": {"crop": "Tomato", "condition": "Leaf Mold", "is_healthy": False},
    "Tomato___Septoria_leaf_spot": {"crop": "Tomato", "condition": "Septoria Leaf Spot", "is_healthy": False},
    "Tomato___Spider_mites Two-spotted_spider_mite": {"crop": "Tomato", "condition": "Two-Spotted Spider Mite", "is_healthy": False},
    "Tomato___Target_Spot": {"crop": "Tomato", "condition": "Target Spot", "is_healthy": False},
    "Tomato___Tomato_Yellow_Leaf_Curl_Virus": {"crop": "Tomato", "condition": "Yellow Leaf Curl Virus", "is_healthy": False},
    "Tomato___Tomato_mosaic_virus": {"crop": "Tomato", "condition": "Mosaic Virus", "is_healthy": False},
    "Tomato___healthy": {"crop": "Tomato", "condition": "Healthy", "is_healthy": True},
}

CLASS_NAMES_LIST: List[str] = sorted(list(PLANTVILLAGE_CLASSES.keys()))


class PlantVillageCatalog:
    """
    Catalog and manifest builder for PlantVillage crop imagery.
    """

    def __init__(self, raw_data_dir: Optional[Path] = None):
        self.raw_data_dir = raw_data_dir or Path("ai-service/data/raw/plantvillage")

    def inspect_and_build_manifest(self, dest_manifest: Optional[Path] = None) -> Dict[str, Any]:
        """
        Scans dataset directory, inspects class balance, and writes JSON manifest.
        """
        counts: Dict[str, int] = {}
        total_images = 0

        if self.raw_data_dir.exists():
            for class_dir in self.raw_data_dir.iterdir():
                if class_dir.is_dir():
                    images = list(class_dir.glob("*.jpg")) + list(class_dir.glob("*.JPG")) + list(class_dir.glob("*.png"))
                    n = len(images)
                    counts[class_dir.name] = n
                    total_images += n

        manifest = {
            "dataset_name": "PlantVillage",
            "source_provenance": "Penn State University / EPFL PlantVillage Project",
            "license": "CC BY-SA 4.0",
            "total_supported_classes": len(CLASS_NAMES_LIST),
            "classes_catalog": PLANTVILLAGE_CLASSES,
            "images_found_locally": total_images,
            "local_class_distribution": counts,
            "status": "CATALOGED" if total_images > 0 else "CATALOG_READY_AWAITING_DOWNLOAD",
        }

        if dest_manifest:
            dest_manifest.parent.mkdir(parents=True, exist_ok=True)
            with open(dest_manifest, "w", encoding="utf-8") as f:
                json.dump(manifest, f, indent=2)
            logger.info(f"PlantVillage manifest saved to {dest_manifest}")

        return manifest

