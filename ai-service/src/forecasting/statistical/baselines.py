"""
AgriSense AI Service — Statistical Baseline Forecasters (Stage 5/6)
===================================================================
Establishes mandatory benchmark baselines:
- LastObservationBaseline (Naive Persistence)
- SeasonalNaiveBaseline (Lag 7 Seasonal Persistence)
- MovingAverageBaseline (Rolling Mean Window 7)
- SARIMABaseline (Auto-Regressive Integrated Moving Average)
"""

from typing import Dict, Optional
import numpy as np
import pandas as pd
from statsmodels.tsa.statespace.sarimax import SARIMAX

from src.forecasting.evaluation.metrics import compute_forecast_metrics


class LastObservationBaseline:
    """Predicts y_{t+h} = y_t."""

    def __init__(self):
        self.last_val: Optional[float] = None

    def fit(self, y: pd.Series):
        clean_y = y.dropna()
        self.last_val = float(clean_y.iloc[-1]) if len(clean_y) > 0 else 0.0

    def predict(self, steps: int = 1) -> np.ndarray:
        return np.full(steps, self.last_val)


class SeasonalNaiveBaseline:
    """Predicts y_{t+h} = y_{t+h - seasonality}."""

    def __init__(self, season_length: int = 7):
        self.season_length = season_length
        self.history: np.ndarray = np.array([])

    def fit(self, y: pd.Series):
        clean_y = y.dropna().values
        self.history = clean_y

    def predict(self, steps: int = 1) -> np.ndarray:
        if len(self.history) == 0:
            return np.zeros(steps)
        preds = []
        hist_list = list(self.history)
        for _ in range(steps):
            idx = -self.season_length if len(hist_list) >= self.season_length else -1
            val = hist_list[idx]
            preds.append(val)
            hist_list.append(val)
        return np.array(preds)


class MovingAverageBaseline:
    """Predicts average of past N observations."""

    def __init__(self, window: int = 7):
        self.window = window
        self.ma_val: float = 0.0

    def fit(self, y: pd.Series):
        clean_y = y.dropna()
        if len(clean_y) >= self.window:
            self.ma_val = float(clean_y.iloc[-self.window:].mean())
        elif len(clean_y) > 0:
            self.ma_val = float(clean_y.mean())
        else:
            self.ma_val = 0.0

    def predict(self, steps: int = 1) -> np.ndarray:
        return np.full(steps, self.ma_val)


class SARIMABaseline:
    """SARIMA(1,1,1)(1,0,0,7) time-series model."""

    def __init__(self, order=(1, 1, 1), seasonal_order=(1, 0, 0, 7)):
        self.order = order
        self.seasonal_order = seasonal_order
        self.fitted_model = None

    def fit(self, y: pd.Series):
        try:
            model = SARIMAX(
                y.dropna(),
                order=self.order,
                seasonal_order=self.seasonal_order,
                enforce_stationarity=False,
                enforce_invertibility=False,
            )
            self.fitted_model = model.fit(disp=False)
        except Exception:
            # Fallback to simple AR(1)
            model = SARIMAX(y.dropna(), order=(1, 1, 0))
            self.fitted_model = model.fit(disp=False)

    def predict(self, steps: int = 1) -> np.ndarray:
        if self.fitted_model is None:
            return np.zeros(steps)
        forecast = self.fitted_model.forecast(steps=steps)
        return np.asarray(forecast)

