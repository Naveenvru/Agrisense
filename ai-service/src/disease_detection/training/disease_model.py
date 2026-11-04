"""
AgriSense AI Service — Deep Learning Disease Classifier (Stage 9)
=================================================================
MobileNetV3-Small transfer learning architecture for edge-efficient crop disease diagnosis.
Includes forward hooks for Grad-CAM activation mapping.
"""

from typing import Optional
import torch
import torch.nn as nn
from torchvision.models import MobileNet_V3_Small_Weights, mobilenet_v3_small

from src.disease_detection.datasets.plantvillage_loader import CLASS_NAMES_LIST


class AgriDiseaseClassifier(nn.Module):
    """
    MobileNetV3-Small classifier adapted for 38 PlantVillage crop disease classes.
    """

    def __init__(self, num_classes: int = len(CLASS_NAMES_LIST), pretrained: bool = False):
        super().__init__()
        weights = MobileNet_V3_Small_Weights.DEFAULT if pretrained else None
        self.backbone = mobilenet_v3_small(weights=weights)

        # Replace classification head
        in_features = self.backbone.classifier[3].in_features
        self.backbone.classifier[3] = nn.Sequential(
            nn.Dropout(p=0.2),
            nn.Linear(in_features, num_classes),
        )

        # Storage for Grad-CAM activations and gradients
        self.gradients: Optional[torch.Tensor] = None
        self.activations: Optional[torch.Tensor] = None

        # Hook last convolutional layer in features
        target_layer = self.backbone.features[-1]
        target_layer.register_forward_hook(self._forward_hook)
        target_layer.register_full_backward_hook(self._backward_hook)

    def _forward_hook(self, module, input, output):
        self.activations = output

    def _backward_hook(self, module, grad_input, grad_output):
        self.gradients = grad_output[0]

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        return self.backbone(x)
