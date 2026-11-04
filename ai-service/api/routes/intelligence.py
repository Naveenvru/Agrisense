"""
AgriSense AI Service — Agricultural Intelligence & RAG Router
=============================================================
Endpoints for conversational assistance, ChromaDB semantic search, and bilingual report generation.
"""

import logging
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from src.llm.provider import DeterministicAgronomicEngine, get_llm_provider
from src.rag.agricultural_kb import AgriculturalRAG
from src.reports.report_generator import BilingualReportGenerator
from src.langchain_agents.agricultural_chain import AgriculturalLangChainAgent

logger = logging.getLogger(__name__)
router = APIRouter(prefix="", tags=["Agricultural Intelligence & RAG"])

_rag_instance: Optional[AgriculturalRAG] = None
_chain_instance: Optional[AgriculturalLangChainAgent] = None


def get_rag() -> AgriculturalRAG:
    global _rag_instance
    if _rag_instance is None:
        _rag_instance = AgriculturalRAG()
    return _rag_instance


def get_chain() -> AgriculturalLangChainAgent:
    global _chain_instance
    if _chain_instance is None:
        _chain_instance = AgriculturalLangChainAgent(rag_instance=get_rag())
    return _chain_instance


# --- Pydantic Schemas ---
class ChatRequest(BaseModel):
    message: Optional[str] = Field(default=None, example="What is the recommended treatment for early blight in tomato?")
    prompt: Optional[str] = Field(default=None, example="Analyze tomato prices in Bengaluru")
    history: Optional[List[Dict[str, Any]]] = Field(default=None)
    crop: Optional[str] = Field(default=None, example="Tomato")
    market: Optional[str] = Field(default=None, example="Bengaluru")
    language: Optional[str] = Field(default="en", example="en")


class RagQueryRequest(BaseModel):
    query: str = Field(..., example="Late blight prevention in potato")
    crop_filter: Optional[str] = Field(default=None, example="Potato")
    n_results: int = Field(default=3, ge=1, le=10)


class MarketReportRequest(BaseModel):
    commodity: str = Field(..., example="Tomato")
    market: str = Field(..., example="Bengaluru")
    state: str = Field(default="Karnataka")
    district: str = Field(default="Bengaluru Urban")
    current_price: float = Field(..., example=1500.0)
    forecast_1d: float = Field(..., example=1510.0)
    forecast_3d: float = Field(..., example=1530.0)
    forecast_7d: float = Field(..., example=1560.0)
    model_name: str = Field(default="Ridge-AR-Ensemble")
    validation_mae: float = Field(default=0.25)
    language: str = Field(default="en")


class DiseaseReportRequest(BaseModel):
    crop: str = Field(..., example="Tomato")
    condition: str = Field(..., example="Early Blight")
    confidence_score: float = Field(..., example=0.92)
    confidence_tier: str = Field(default="HIGH_CONFIDENCE")
    advisory_note: str = Field(...)
    language: str = Field(default="en")


# --- Endpoints ---
@router.post("/rag/query")
def query_agricultural_rag(req: RagQueryRequest):
    rag = get_rag()
    results = rag.query_knowledge(
        query_text=req.query,
        n_results=req.n_results,
        crop_filter=req.crop_filter,
    )
    return {
        "query": req.query,
        "crop_filter": req.crop_filter,
        "matched_documents_count": len(results),
        "results": results,
    }


@router.post("/chat")
def agricultural_chat(req: ChatRequest):
    query_text = req.prompt or req.message or "Hello"
    chain = get_chain()
    result = chain.run(
        question=query_text,
        history=req.history,
        crop_filter=req.crop,
        prefer_gemini=True,
    )
    return {
        "reply": result["text"],
        "text": result["text"],
        "model": result["model"],
        "intent": result["intent"],
        "language": req.language or "en",
        "citations": result["citations"],
        "matched_documents_count": result.get("matched_documents_count", 0),
    }


@router.post("/reports/market")
def generate_market_report(req: MarketReportRequest):
    report = BilingualReportGenerator.generate_market_report(
        commodity=req.commodity,
        state=req.state,
        district=req.district,
        market=req.market,
        current_price=req.current_price,
        forecast_1d=req.forecast_1d,
        forecast_3d=req.forecast_3d,
        forecast_7d=req.forecast_7d,
        model_name=req.model_name,
        val_mae=req.validation_mae,
        language=req.language,
    )
    return report


@router.post("/reports/disease")
def generate_disease_report(req: DiseaseReportRequest):
    report = BilingualReportGenerator.generate_disease_report(
        crop=req.crop,
        condition=req.condition,
        confidence_score=req.confidence_score,
        confidence_tier=req.confidence_tier,
        advisory_note=req.advisory_note,
        citations=[],
        language=req.language,
    )
    return report

