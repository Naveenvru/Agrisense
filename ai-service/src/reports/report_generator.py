"""
AgriSense AI Service — Bilingual Agricultural Report Generation (Stage 13)
===========================================================================
Generates structured Market Intelligence and Crop Health reports in English and Kannada.
Adheres strictly to enterprise integrity:
- Real forecasts and evaluation metrics only
- Clear uncertainty bounds
- Mandatory KVK/Agricultural Extension disclaimer
"""

import json
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional


class BilingualReportGenerator:
    """
    Produces deterministic structured agricultural reports in English and Kannada.
    """

    @staticmethod
    def generate_market_report(
        commodity: str,
        state: str,
        district: str,
        market: str,
        current_price: float,
        forecast_1d: float,
        forecast_3d: float,
        forecast_7d: float,
        model_name: str,
        val_mae: float,
        language: str = "en",
    ) -> Dict[str, Any]:
        """Generates comprehensive market advisory report."""
        timestamp = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")

        pct_change = round(((forecast_7d - current_price) / (current_price + 1e-6)) * 100, 2)
        trend_en = "Upward / Bullish" if pct_change > 1.0 else "Downward / Bearish" if pct_change < -1.0 else "Stable"
        trend_kn = "ಏರಿಕೆ ಮುನ್ಸೂಚನೆ" if pct_change > 1.0 else "ಇಳಿಕೆ ಮುನ್ಸೂಚನೆ" if pct_change < -1.0 else "ಸ್ಥಿರ"

        if language == "kn":
            content = f"""# ಕೃಷಿಸೆನ್ಸ್ ಮಾರುಕಟ್ಟೆ ವರದಿ (AgriSense Market Report)
**ದಿನಾಂಕ:** {timestamp}
**ಬೆಳೆ:** {commodity} | **ಮಾರುಕಟ್ಟೆ:** {market} ({district}, {state})

## ೧. ಪ್ರಸ್ತುತ ದರ ವಿವರ (Current Price)
- ಇಂದಿನ ಮಾದರಿ ದರ (Modal Price): **₹{current_price:,.2f} / ಕ್ವಿಂಟಾಲ್**

## ೨. ಮುನ್ಸೂಚನೆ (Price Projections)
- ಮುಂದಿನ ೧ ದಿನ (1-Day): **₹{forecast_1d:,.2f} / ಕ್ವಿಂಟಾಲ್**
- ಮುಂದಿನ ೩ ದಿನಗಳು (3-Day): **₹{forecast_3d:,.2f} / ಕ್ವಿಂಟಾಲ್**
- ಮುಂದಿನ ೭ ದಿನಗಳು (7-Day): **₹{forecast_7d:,.2f} / ಕ್ವಿಂಟಾಲ್**
- ಮಾರುಕಟ್ಟೆ ಪ್ರವೃತ್ತಿ: **{trend_kn} ({pct_change:+.1f}%)**

## ೩. ಎಐ ಮಾದರಿ ಮಾಹಿತಿ (Model Provenance)
- ಚಾಲಿತ ಮಾದರಿ: {model_name}
- ಮಾನ್ಯತೆ ದೋಷ (Validation MAE): ±₹{val_mae:.2f} / ಕ್ವಿಂಟಾಲ್
- ಮೂಲ ದತ್ತಾಂಶ: ಅಧಿಕೃತ ಎಪಿಎಂಸಿ ಆವಕ ಮತ್ತು ಬೆಲೆ ದಾಖಲೆಗಳು (AGMARKNET)

> **ಗಮನಿಸಿ:** ಈ ಮುನ್ಸೂಚನೆಯು ಗಣಿತೀಯ ಮಾದರಿಗಳನ್ನು ಆಧರಿಸಿದೆ. ಅಂತಿಮ ನಿರ್ಧಾರ ತೆಗೆದುಕೊಳ್ಳುವ ಮುನ್ನ ಸ್ಥಳೀಯ ಮಾರುಕಟ್ಟೆ ಪರಿಸ್ಥಿತಿಯನ್ನು ಪರಿಶೀಲಿಸಿ.
"""
        else:
            content = f"""# AgriSense Market Intelligence Report
**Generated At:** {timestamp}
**Commodity:** {commodity} | **Market Mandi:** {market} ({district}, {state})

## 1. Verified Mandi Price
- Latest Modal Price: **₹{current_price:,.2f} / Quintal**

## 2. Multi-Horizon AI Projections
- 1-Day Horizon: **₹{forecast_1d:,.2f} / Quintal**
- 3-Day Horizon: **₹{forecast_3d:,.2f} / Quintal**
- 7-Day Horizon: **₹{forecast_7d:,.2f} / Quintal**
- Expected Trend: **{trend_en} ({pct_change:+.1f}%)**

## 3. Algorithmic Provenance & Accuracy
- Underlying Forecasting Engine: {model_name}
- Empirical Validation MAE: ±₹{val_mae:.2f} / Quintal
- Source Provider: AGMARKNET Daily Mandi Returns

> **Notice:** Projections represent statistical estimations under historical arrival distributions. Local weather and seasonal logistics may influence real-time spot settlement.
"""

        return {
            "commodity": commodity,
            "market": market,
            "language": language,
            "generated_at": timestamp,
            "report_markdown": content,
            "forecast_summary": {
                "current_price": current_price,
                "horizon_1d": forecast_1d,
                "horizon_3d": forecast_3d,
                "horizon_7d": forecast_7d,
                "trend": trend_en,
            },
        }

    @staticmethod
    def generate_disease_report(
        crop: str,
        condition: str,
        confidence_score: float,
        confidence_tier: str,
        advisory_note: str,
        citations: List[Dict[str, Any]],
        language: str = "en",
    ) -> Dict[str, Any]:
        """Generates crop health diagnosis report."""
        timestamp = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")

        if language == "kn":
            content = f"""# ಕೃಷಿಸೆನ್ಸ್ ಬೆಳೆ ರೋಗ ತಪಾಸಣೆ ವರದಿ (Crop Health Report)
**ದಿನಾಂಕ:** {timestamp}
**ಬೆಳೆ:** {crop}
**ಗುರುತಿಸಲಾದ ಸ್ಥಿತಿ:** {condition}
**ವಿಶ್ವಾಸಾರ್ಹತೆ (Confidence):** {confidence_score * 100:.1f}% ({confidence_tier})

## ರೋಗ ನಿರ್ವಹಣಾ ಸಲಹೆ:
{advisory_note}

> **ಎಚ್ಚರಿಕೆ:** ಈ ರೋಗನಿರ್ಣಯವು ಕಂಪ್ಯೂಟರ್ ವಿಷನ್ ಸಂಖ್ಯಾಶಾಸ್ತ್ರೀಯ ಸಂಭವನೀಯತೆಯನ್ನು ಆಧರಿಸಿದೆ. ರಾಸಾಯನಿಕ ಸಿಂಪಡಿಸುವ ಮೊದಲು ಹತ್ತಿರದ ಕೃಷಿ ವಿಜ್ಞಾನ ಕೇಂದ್ರ (KVK) ಅಧಿಕಾರಿಗಳ ಸಲಹೆ ಪಡೆಯಿರಿ.
"""
        else:
            content = f"""# AgriSense Crop Health & Pathogen Advisory
**Generated At:** {timestamp}
**Target Crop:** {crop}
**Identified Condition:** {condition}
**Model Statistical Confidence:** {confidence_score * 100:.1f}% ({confidence_tier})

## Verified Agronomic Advisory & Management:
{advisory_note}

> **Advisory Disclaimer:** Computer vision inference represents pattern attribution and not absolute diagnostic certainty. Chemical applications should comply with label specifications and local Krishi Vigyan Kendra (KVK) advisories.
"""

        return {
            "crop": crop,
            "condition": condition,
            "confidence_score": confidence_score,
            "language": language,
            "generated_at": timestamp,
            "report_markdown": content,
        }

