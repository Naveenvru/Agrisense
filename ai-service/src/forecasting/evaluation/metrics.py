"""
AgriSense AI Service — Time-Series Evaluation Metrics (Stage 5/6)
================================================================
Enterprise evaluation metrics strictly adhering to time-series forecasting standards:
- MAE (Mean Absolute Error)
- RMSE (Root Mean Squared Error)
- WAPE (Weighted Absolute Percentage Error)
- sMAPE (Symmetric Mean Absolute Percentage Error)
- R2 Score
"""

from typing import Dict
import numpy as np
import pandas as pd


def compute_forecast_metrics(y_true: np.ndarray, y_pred: np.ndarray) -> Dict[str, float]:
    """
    Computes standard regression & forecast accuracy metrics on numpy arrays.
    """
    y_t = np.asarray(y_true, dtype=float)
    y_p = np.asarray(y_pred, dtype=float)

    # Filter out NaNs
    mask = ~np.isnan(y_t) & ~np.isnan(y_p)
    if mask.sum() == 0:
        return {"mae": np.nan, "rmse": np.nan, "wape": np.nan, "smape": np.nan, "r2": np.nan}

    y_t = y_t[mask]
    y_p = y_p[mask]

    diff = y_t - y_p
    abs_diff = np.abs(diff)

    mae = float(np.mean(abs_diff))
    rmse = float(np.sqrt(np.mean(diff ** 2)))

    # WAPE (Weighted Absolute Percentage Error)
    denom_wape = np.sum(np.abs(y_t))
    wape = float(np.sum(abs_diff) / denom_wape) if denom_wape > 0 else 0.0

    # sMAPE
    denom_smape = (np.abs(y_t) + np.abs(y_p)) / 2.0 + 1e-6
    smape = float(np.mean(abs_diff / denom_smape) * 100.0)

    # R2
    ss_res = np.sum(diff ** 2)
    ss_tot = np.sum((y_t - np.mean(y_t)) ** 2)
    r2 = float(1.0 - (ss_res / (ss_tot + 1e-9)))

    return {
        "mae": round(mae, 2),
        "rmse": round(rmse, 2),
        "wape": round(wape, 4),
        "smape": round(smape, 2),
        "r2": round(r2, 4),
    }

