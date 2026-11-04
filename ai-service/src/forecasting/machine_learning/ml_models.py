"""
AgriSense AI Service — Machine Learning Forecasting Models (Stage 6)
====================================================================
Implements competitive ML regression models for time-series forecasting:
- Ridge Regression
- Random Forest
- Extra Trees
- Gradient Boosting
- XGBoost
- LightGBM
- CatBoost

Design principles:
- Strict chronological training and validation
- Hyperparameters tuned on validation set ONLY
- Final unbiased evaluation on untouched test set
- Serializes winning model and saves evaluation leaderboard
"""

import json
import logging
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

import joblib
import numpy as np
import pandas as pd
from catboost import CatBoostRegressor
from lightgbm import LGBMRegressor
from sklearn.ensemble import ExtraTreesRegressor, GradientBoostingRegressor, RandomForestRegressor
from sklearn.linear_model import Ridge
from xgboost import XGBRegressor

from src.forecasting.evaluation.metrics import compute_forecast_metrics

logger = logging.getLogger(__name__)

META_COLS_TO_DROP = [
    "observation_date",
    "state",
    "district",
    "market",
    "commodity",
    "variety",
    "grade",
    "price_unit",
    "arrival_unit",
    "source_provider",
    "source_record_id",
    "source_file",
    "source_row",
    "raw_record_hash",
    "ingested_at",
    "quality_flags",
    "month_year",
]


class PriceForecastingModelSuite:
    """
    Automated training, validation, and benchmarking of multi-family ML models.
    """

    def __init__(self, random_state: int = 42):
        self.random_state = random_state
        self.models: Dict[str, Any] = {
            "Ridge": Ridge(alpha=1.0),
            "RandomForest": RandomForestRegressor(
                n_estimators=100, max_depth=8, min_samples_split=4, random_state=random_state, n_jobs=-1
            ),
            "ExtraTrees": ExtraTreesRegressor(
                n_estimators=100, max_depth=8, min_samples_split=4, random_state=random_state, n_jobs=-1
            ),
            "GradientBoosting": GradientBoostingRegressor(
                n_estimators=100, max_depth=4, learning_rate=0.05, random_state=random_state
            ),
            "XGBoost": XGBRegressor(
                n_estimators=100, max_depth=4, learning_rate=0.05, random_state=random_state, verbosity=0
            ),
            "LightGBM": LGBMRegressor(
                n_estimators=100, max_depth=5, learning_rate=0.05, random_state=random_state, verbose=-1
            ),
            "CatBoost": CatBoostRegressor(
                iterations=150, depth=5, learning_rate=0.05, random_seed=random_state, verbose=0
            ),
        }
        self.fitted_models: Dict[str, Any] = {}
        self.leaderboard: List[Dict[str, Any]] = []

    def prepare_data(
        self,
        train_df: pd.DataFrame,
        val_df: pd.DataFrame,
        test_df: pd.DataFrame,
        target_col: str = "modal_price",
    ) -> Tuple[pd.DataFrame, pd.Series, pd.DataFrame, pd.Series, pd.DataFrame, pd.Series, List[str]]:
        """
        Extracts clean numeric feature matrices and aligns targets.
        Excludes columns with high missingness and ensures robust chronological matrices.
        """
        # Exclude metadata and columns with > 40% missing values
        feature_cols = []
        for c in train_df.columns:
            if c not in META_COLS_TO_DROP and c != target_col and pd.api.types.is_numeric_dtype(train_df[c]):
                non_null_ratio = train_df[c].notnull().mean()
                if non_null_ratio >= 0.60:
                    feature_cols.append(c)

        def clean_split(df: pd.DataFrame):
            clean = df.copy()
            # Impute initial warm-up lags using backfill then forward fill within the historical slice
            clean[feature_cols] = clean[feature_cols].bfill().ffill()
            clean = clean.dropna(subset=feature_cols + [target_col])
            X = clean[feature_cols].copy()
            y = clean[target_col].copy()
            return X, y

        X_train, y_train = clean_split(train_df)
        X_val, y_val = clean_split(val_df)
        X_test, y_test = clean_split(test_df)

        return X_train, y_train, X_val, y_val, X_test, y_test, feature_cols

    def train_and_benchmark(
        self,
        train_df: pd.DataFrame,
        val_df: pd.DataFrame,
        test_df: pd.DataFrame,
        target_col: str = "modal_price",
    ) -> Dict[str, Any]:
        """
        Fits all models, ranks by validation performance, evaluates best model on test set.
        """
        X_train, y_train, X_val, y_val, X_test, y_test, feature_cols = self.prepare_data(
            train_df, val_df, test_df, target_col
        )

        if len(X_train) < 10:
            raise ValueError(f"Insufficient training observations: {len(X_train)}")

        results: List[Dict[str, Any]] = []

        for name, model in self.models.items():
            try:
                # 1. Fit on Training Set
                model.fit(X_train, y_train)
                self.fitted_models[name] = model

                # 2. Predict on Validation Set
                val_preds = model.predict(X_val)
                val_metrics = compute_forecast_metrics(y_val.values, val_preds)

                # 3. Predict on Training Set (to measure fitting/overfitting)
                train_preds = model.predict(X_train)
                train_metrics = compute_forecast_metrics(y_train.values, train_preds)

                results.append({
                    "model": name,
                    "val_mae": val_metrics["mae"],
                    "val_rmse": val_metrics["rmse"],
                    "val_smape": val_metrics["smape"],
                    "val_wape": val_metrics["wape"],
                    "val_r2": val_metrics["r2"],
                    "train_mae": train_metrics["mae"],
                    "train_rmse": train_metrics["rmse"],
                })
            except Exception as e:
                logger.error(f"Error training {name}: {e}")

        # Rank by validation MAE (ascending)
        results = sorted(results, key=lambda x: x["val_mae"])
        self.leaderboard = results

        best_model_name = results[0]["model"]
        best_model = self.fitted_models[best_model_name]

        # 4. Final Untouched Test Set Evaluation of Winning Model
        test_preds = best_model.predict(X_test)
        test_metrics = compute_forecast_metrics(y_test.values, test_preds)

        benchmark_summary = {
            "best_model": best_model_name,
            "feature_columns": feature_cols,
            "training_samples": len(X_train),
            "validation_samples": len(X_val),
            "test_samples": len(X_test),
            "validation_leaderboard": results,
            "test_evaluation": test_metrics,
        }

        return benchmark_summary

    def save_best_model(self, dest_path: Path, metadata: Dict[str, Any]) -> Path:
        """
        Saves the best fitted model and its metadata artifact.
        """
        dest_path.parent.mkdir(parents=True, exist_ok=True)
        best_name = metadata.get("best_model")
        best_model = self.fitted_models[best_name]

        payload = {
            "model_name": best_name,
            "model": best_model,
            "metadata": metadata,
        }
        joblib.dump(payload, dest_path)
        logger.info(f"Winning model {best_name} saved to {dest_path}")
        return dest_path
