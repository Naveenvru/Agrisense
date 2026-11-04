"""
AgriSense AI Service — Crop Disease Identification Router
=========================================================
PyTorch deep learning inference with Grad-CAM heatmaps & uncertainty classification.
"""

import base64
import logging
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, File, HTTPException, UploadFile
from pydantic import BaseModel, Field

from src.disease_detection.datasets.plantvillage_loader import (
    CLASS_NAMES_LIST,
    PLANTVILLAGE_CLASSES,
)
from src.disease_detection.inference.predict import DiseasePredictor

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/disease", tags=["Disease Detection"])


class DiseasePredictRequest(BaseModel):
    image_base64: str = Field(..., description="Base64 encoded image string (JPEG/PNG)")
    generate_gradcam: bool = Field(default=True, description="Whether to compute Grad-CAM heatmap")


@router.get("/classes")
def get_supported_classes():
    return {
        "total_classes": len(CLASS_NAMES_LIST),
        "classes": PLANTVILLAGE_CLASSES,
    }


@router.get("/models")
def get_model_info():
    return {
        "architecture": "MobileNetV3-Small (Transfer Learning)",
        "framework": "PyTorch 2.15",
        "input_resolution": "224x224 RGB",
        "num_classes": len(CLASS_NAMES_LIST),
        "explainability": "Grad-CAM (Gradient-weighted Class Activation Mapping)",
        "uncertainty_mechanism": "Calibrated Softmax with Tri-Tier Risk Thresholds",
        "device": "CPU / CUDA Auto-detected",
    }


@router.post("/predict")
async def predict_crop_disease(file: UploadFile = File(...)):
    """
    Accepts multipart leaf image upload and returns pathogen prediction + Grad-CAM heatmap.
    """
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Uploaded file must be a valid image (JPEG/PNG)")

    image_bytes = await file.read()
    if len(image_bytes) == 0:
        raise HTTPException(status_code=400, detail="Uploaded image file is empty")

    predictor = DiseasePredictor.get_instance()
    try:
        result = predictor.predict_image(image_bytes, top_k=3, generate_gradcam=True)
        return result
    except Exception as e:
        logger.error(f"Inference error: {e}")
        raise HTTPException(status_code=500, detail=f"Image inference failed: {str(e)}")


@router.post("/predict/base64")
def predict_crop_disease_base64(req: DiseasePredictRequest):
    """
    Accepts base64 encoded image string.
    """
    try:
        raw_b64 = req.image_base64
        if "," in raw_b64:
            raw_b64 = raw_b64.split(",")[1]
        image_bytes = base64.b64decode(raw_b64)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid base64 encoding: {e}")

    predictor = DiseasePredictor.get_instance()
    try:
        result = predictor.predict_image(image_bytes, top_k=3, generate_gradcam=req.generate_gradcam)
        return result
    except Exception as e:
        logger.error(f"Inference error: {e}")
        raise HTTPException(status_code=500, detail=f"Image inference failed: {str(e)}")

