"""
AgriSense AI Microservice — Main Application Entry Point (Stage 14)
===================================================================
Production FastAPI microservice integrating:
- Price forecasting engines
- PyTorch disease classification & Grad-CAM
- ChromaDB agricultural RAG
- LangChain multi-provider conversational intelligence
- Bilingual agricultural report generator
"""

import logging
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.routes.disease import router as disease_router
from api.routes.intelligence import router as intelligence_router
from api.routes.market import router as market_router
from src.disease_detection.inference.predict import DiseasePredictor
from src.rag.agricultural_kb import AgriculturalRAG

# Configure structured logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("agrisense-ai")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Startup & shutdown events:
    Preloads ML model weights and ChromaDB collections into RAM to ensure sub-100ms inference.
    """
    logger.info("Initializing AgriSense AI Microservice...")

    # 1. Preload Disease Vision Model
    try:
        predictor = DiseasePredictor.get_instance()
        logger.info(f"Disease Vision Model loaded on {predictor.device}")
    except Exception as e:
        logger.warning(f"Disease Vision Model initialization notice: {e}")

    # 2. Preload ChromaDB Vector Knowledge Base
    try:
        rag = AgriculturalRAG()
        logger.info(f"ChromaDB Vector Store loaded ({rag.collection.count()} advisories)")
    except Exception as e:
        logger.warning(f"ChromaDB initialization notice: {e}")

    logger.info("AgriSense AI Microservice successfully initialized and ready for requests.")
    yield
    logger.info("Shutting down AgriSense AI Microservice...")


app = FastAPI(
    title="AgriSense AI Microservice",
    description="Enterprise agricultural intelligence platform providing price forecasting, foliar disease detection, and agronomic RAG.",
    version="2.0.0",
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Modular Routers
app.include_router(market_router)
app.include_router(disease_router)
app.include_router(intelligence_router)


@app.get("/", tags=["Root"])
def root():
    return {
        "service": "AgriSense AI Microservice",
        "status": "online",
        "documentation": "/docs",
        "version": "2.0.0",
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=False)
