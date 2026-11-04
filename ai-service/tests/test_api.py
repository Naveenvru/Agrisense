"""
AgriSense AI Service — Test Suite (Stage 16)
============================================
Comprehensive test suite verifying endpoints, schemas, and inference pipelines.
"""

import sys
from pathlib import Path

# Add ai-service to path
ROOT_DIR = Path(__file__).resolve().parent.parent
sys.path.append(str(ROOT_DIR))

from main import root
from api.routes.market import (
    health_check,
    get_markets,
    get_commodities,
    forecast_price,
    ForecastRequest,
    get_model_metrics,
)
from api.routes.disease import get_supported_classes, get_model_info
from api.routes.intelligence import (
    query_agricultural_rag,
    RagQueryRequest,
    generate_market_report,
    MarketReportRequest,
    agricultural_chat,
    ChatRequest,
)


def test_root():
    data = root()
    assert data["service"] == "AgriSense AI Microservice"
    assert data["status"] == "online"


def test_health():
    data = health_check()
    assert data["status"] == "healthy"
    assert "price_forecasting" in data["components"]


def test_markets_and_commodities():
    markets = get_markets()
    assert isinstance(markets, list)
    assert len(markets) > 0

    commodities = get_commodities()
    assert isinstance(commodities, list)
    assert "Tomato" in commodities


def test_price_forecast():
    req = ForecastRequest(
        commodity="Tomato",
        market="Bengaluru",
        state="Karnataka",
        current_modal_price=1400.0,
        horizon_days=7,
    )
    res = forecast_price(req)
    assert res.commodity == "Tomato"
    assert res.market == "Bengaluru"
    assert res.projected_price > 0
    assert len(res.daily_trajectory) == 7
    assert res.confidence_interval_95["upper"] > res.confidence_interval_95["lower"]


def test_disease_classes_and_models():
    classes_res = get_supported_classes()
    assert classes_res["total_classes"] == 38

    model_res = get_model_info()
    assert "MobileNetV3" in model_res["architecture"]


def test_rag_semantic_search():
    req = RagQueryRequest(
        query="Early blight tomato spraying",
        crop_filter="Tomato",
        n_results=2,
    )
    res = query_agricultural_rag(req)
    assert res["matched_documents_count"] > 0
    assert any("Tomato" in doc["crop"] for doc in res["results"])


def test_bilingual_market_report():
    # English
    req_en = MarketReportRequest(
        commodity="Tomato",
        market="Bengaluru",
        state="Karnataka",
        district="Bengaluru Urban",
        current_price=1500.0,
        forecast_1d=1510.0,
        forecast_3d=1525.0,
        forecast_7d=1550.0,
        language="en",
    )
    res_en = generate_market_report(req_en)
    assert "AgriSense Market Intelligence Report" in res_en["report_markdown"]

    # Kannada
    req_kn = req_en.model_copy(update={"language": "kn"})
    res_kn = generate_market_report(req_kn)
    assert "ಕೃಷಿಸೆನ್ಸ್ ಮಾರುಕಟ್ಟೆ ವರದಿ" in res_kn["report_markdown"]


def test_chat_intelligence():
    req_chat = ChatRequest(
        message="How to control late blight in potato?",
        crop="Potato",
        language="en",
    )
    res = agricultural_chat(req_chat)
    assert len(res["reply"]) > 50
    assert len(res["citations"]) > 0


def run_all_tests():
    print("============================================================")
    print("AGRISENSE AI — MICROSERVICE VERIFICATION SUITE")
    print("============================================================")

    test_root()
    print("  [PASS] 1. Root Endpoint (GET /)")

    test_health()
    print("  [PASS] 2. Health Check (GET /health)")

    test_markets_and_commodities()
    print("  [PASS] 3. Mandi & Commodity Enumeration (GET /markets, /commodities)")

    test_price_forecast()
    print("  [PASS] 4. Multi-Horizon AI Price Forecast (POST /forecast)")

    test_disease_classes_and_models()
    print("  [PASS] 5. Disease Classifier Metadata (GET /disease/classes, /models)")

    test_rag_semantic_search()
    print("  [PASS] 6. ChromaDB Vector RAG Retrieval (POST /rag/query)")

    test_bilingual_market_report()
    print("  [PASS] 7. Bilingual Report Generation (POST /reports/market EN & KN)")

    test_chat_intelligence()
    print("  [PASS] 8. Conversational Agronomic Assistant (POST /chat)")

    print("\n============================================================")
    print("ALL 8 ENDPOINT TESTS PASSED WITH 100% SUCCESS!")
    print("============================================================")


if __name__ == "__main__":
    run_all_tests()
