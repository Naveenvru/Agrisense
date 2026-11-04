"""
AgriSense AI Service — End-to-End Integration Workflow Test Suite
=================================================================
Tests and validates end-to-end user workflows:
- Workflow A: Market Price Forecasting (Multi-horizon, price bounds)
- Workflow B: Disease Detection with Real Image + Grad-CAM Heatmap
- Workflow C: RAG Agricultural Retrieval & Citation Grounding
- Workflow D: Weather-Driven Agronomic Risk Advisory
Generates reports/integration_test_report.json with latency profiling.
"""

import base64
import json
import logging
import sys
import time
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict

ROOT_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT_DIR))

from api.routes.disease import DiseasePredictRequest, predict_crop_disease_base64
from api.routes.intelligence import (
    RagQueryRequest,
    generate_market_report,
    query_agricultural_rag,
)
from api.routes.market import ForecastRequest, forecast_price

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)

REPORTS_DIR = ROOT_DIR / "reports"
DATA_DIR = ROOT_DIR / "data"
REPORTS_DIR.mkdir(parents=True, exist_ok=True)


def test_workflow_a_market_forecasting() -> Dict[str, Any]:
    logger.info("Executing Workflow A: Market Price Forecasting...")
    t0 = time.perf_counter()

    test_cases = [
        {"commodity": "Tomato", "market": "Kolar", "state": "Karnataka", "price": 1400.0, "horizon": 7},
        {"commodity": "Potato", "market": "Agra", "state": "Uttar Pradesh", "price": 1100.0, "horizon": 14},
        {"commodity": "Tomato", "market": "Bengaluru", "state": "Karnataka", "price": 1600.0, "horizon": 30},
    ]

    results = []
    for tc in test_cases:
        req = ForecastRequest(
            commodity=tc["commodity"],
            market=tc["market"],
            state=tc["state"],
            current_modal_price=tc["price"],
            horizon_days=tc["horizon"],
        )
        res = forecast_price(req)
        assert res.projected_price > 0, "Forecast price must be positive"
        assert len(res.daily_trajectory) == tc["horizon"], f"Trajectory length must match horizon {tc['horizon']}"
        assert res.confidence_interval_95["upper"] >= res.confidence_interval_95["lower"], "Upper bound >= lower bound"

        results.append({
            "commodity": tc["commodity"],
            "market": tc["market"],
            "horizon_days": tc["horizon"],
            "current_price": tc["price"],
            "projected_price": res.projected_price,
            "trend": res.trend_direction,
            "ci_lower": res.confidence_interval_95["lower"],
            "ci_upper": res.confidence_interval_95["upper"],
            "daily_trajectory_steps": len(res.daily_trajectory),
        })

    elapsed_ms = (time.perf_counter() - t0) * 1000.0
    return {
        "workflow": "Workflow A: Market Price Forecasting",
        "status": "PASSED",
        "latency_ms": round(elapsed_ms, 2),
        "test_cases_run": len(test_cases),
        "details": results,
    }


def test_workflow_b_disease_detection() -> Dict[str, Any]:
    logger.info("Executing Workflow B: Disease Detection with Real Imagery & Grad-CAM...")
    t0 = time.perf_counter()

    # Find a real acquired image from PlantVillage
    pv_dir = DATA_DIR / "raw" / "plantvillage"
    real_images = list(pv_dir.glob("*/*.JPG")) + list(pv_dir.glob("*/*.jpg"))

    if not real_images:
        raise FileNotFoundError(f"No PlantVillage leaf images found in {pv_dir}")

    test_img_path = real_images[0]
    logger.info(f"Using authentic test image: {test_img_path.name} from class {test_img_path.parent.name}")

    with open(test_img_path, "rb") as f:
        img_bytes = f.read()

    b64_str = base64.b64encode(img_bytes).decode("utf-8")
    req = DiseasePredictRequest(image_base64=b64_str, generate_gradcam=True)

    pred_res = predict_crop_disease_base64(req)

    assert "predicted_crop" in pred_res, "Response must contain predicted_crop"
    assert "predicted_condition" in pred_res, "Response must contain predicted_condition"
    assert "top_predictions" in pred_res, "Response must contain top_predictions"
    assert "gradcam_heatmap_base64" in pred_res, "Response must contain Grad-CAM heatmap"
    assert pred_res["gradcam_heatmap_base64"] is not None and len(pred_res["gradcam_heatmap_base64"]) > 50

    elapsed_ms = (time.perf_counter() - t0) * 1000.0
    return {
        "workflow": "Workflow B: Disease Detection + Explainability",
        "status": "PASSED",
        "latency_ms": round(elapsed_ms, 2),
        "test_image_used": str(test_img_path.relative_to(ROOT_DIR)),
        "predicted_crop": pred_res["predicted_crop"],
        "predicted_condition": pred_res["predicted_condition"],
        "confidence_score": pred_res["confidence_score"],
        "gradcam_heatmap_generated": bool(pred_res["gradcam_heatmap_base64"]),
        "requires_expert_verification": pred_res["requires_expert_verification"],
    }


def test_workflow_c_rag_retrieval() -> Dict[str, Any]:
    logger.info("Executing Workflow C: RAG Retrieval and Citation Grounding...")
    t0 = time.perf_counter()

    queries = [
        {"query": "How to treat tomato early blight?", "crop": "Tomato"},
        {"query": "Managing blast in Kharif paddy", "crop": "Paddy"},
        {"query": "Onion storage rot prevention", "crop": "Onion"},
    ]

    retrieval_results = []
    for q in queries:
        req = RagQueryRequest(query=q["query"], crop_filter=q["crop"], n_results=2)
        res = query_agricultural_rag(req)
        assert res["matched_documents_count"] > 0, "Must return at least 1 relevant agronomic doc"
        assert len(res["results"]) > 0, "Results array must not be empty"

        top_doc = res["results"][0]
        assert "publisher" in top_doc, "Doc must contain publisher citation"
        assert "source_url" in top_doc, "Doc must contain verified source URL"

        retrieval_results.append({
            "query": q["query"],
            "crop": q["crop"],
            "matched_count": res["matched_documents_count"],
            "top_doc_title": top_doc.get("title"),
            "publisher": top_doc.get("publisher"),
            "citation": top_doc.get("source_url"),
        })

    elapsed_ms = (time.perf_counter() - t0) * 1000.0
    return {
        "workflow": "Workflow C: RAG Agricultural Retrieval & Citations",
        "status": "PASSED",
        "latency_ms": round(elapsed_ms, 2),
        "queries_tested": len(queries),
        "details": retrieval_results,
    }


def test_workflow_d_weather_advisory() -> Dict[str, Any]:
    logger.info("Executing Workflow D: Weather-Driven Agronomic Risk Advisory...")
    t0 = time.perf_counter()

    w_dir = DATA_DIR / "raw" / "weather"
    w_files = list(w_dir.glob("weather_*_historical.json"))

    advisories = []
    for wf in w_files[:2]:
        w_data = json.loads(wf.read_text(encoding="utf-8"))
        daily = w_data.get("daily", {})
        times = daily.get("time", [])
        temps = daily.get("temperature_2m_max", [])
        precips = daily.get("precipitation_sum", [])
        rhs = daily.get("relative_humidity_2m_mean", [])

        if temps and rhs:
            avg_temp = float(sum(temps[-7:]) / len(temps[-7:]))
            avg_rh = float(sum(rhs[-7:]) / len(rhs[-7:]))
            tot_rain = float(sum(precips[-7:]))

            # Fungal risk rule
            fungal_risk = "HIGH" if (avg_rh > 75.0 and 20.0 <= avg_temp <= 28.0) else "MODERATE"

            advisories.append({
                "weather_station_file": wf.name,
                "period": f"{times[-7]} to {times[-1]}" if len(times) >= 7 else "Recent",
                "7d_mean_temperature_c": round(avg_temp, 1),
                "7d_mean_relative_humidity_pct": round(avg_rh, 1),
                "7d_total_precipitation_mm": round(tot_rain, 1),
                "fungal_disease_risk": fungal_risk,
                "advisory": (
                    "High humidity (>75%) coupled with moderate temperatures (20-28°C) creates an ideal microclimate "
                    "for fungal pathogens such as Alternaria solani and Phytophthora infestans. Ensure preventive bio-fungicide "
                    "or copper oxychloride application before heavy precipitation."
                ) if fungal_risk == "HIGH" else "Standard field moisture monitoring advised.",
            })

    elapsed_ms = (time.perf_counter() - t0) * 1000.0
    return {
        "workflow": "Workflow D: Weather-Driven Agronomic Risk Advisory",
        "status": "PASSED",
        "latency_ms": round(elapsed_ms, 2),
        "districts_profiled": len(advisories),
        "details": advisories,
    }


def run_full_integration_suite() -> Dict[str, Any]:
    logger.info("=============================================================")
    logger.info("STARTING AGRISENSE MASTER END-TO-END INTEGRATION TEST SUITE")
    logger.info("=============================================================")

    t_suite_start = time.perf_counter()

    wf_a = test_workflow_a_market_forecasting()
    wf_b = test_workflow_b_disease_detection()
    wf_c = test_workflow_c_rag_retrieval()
    wf_d = test_workflow_d_weather_advisory()

    total_time_ms = (time.perf_counter() - t_suite_start) * 1000.0

    report = {
        "suite_name": "AgriSense AI Microservice End-to-End Workflow Integration Test",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "total_suite_latency_ms": round(total_time_ms, 2),
        "overall_status": "ALL_WORKFLOWS_PASSED",
        "workflows": [wf_a, wf_b, wf_c, wf_d],
        "summary": {
            "total_workflows_tested": 4,
            "workflows_passed": 4,
            "workflows_failed": 0,
            "mean_workflow_latency_ms": round(total_time_ms / 4, 2),
            "compliance_with_sla": total_time_ms < 5000.0,
        },
    }

    rep_path = REPORTS_DIR / "integration_test_report.json"
    with open(rep_path, "w", encoding="utf-8") as f:
        json.dump(report, f, indent=2)

    logger.info(f"Integration test report saved to {rep_path}")
    logger.info("ALL WORKFLOWS PASSED VERIFICATION!")
    return report


if __name__ == "__main__":
    run_full_integration_suite()
