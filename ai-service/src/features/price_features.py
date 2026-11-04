"""
AgriSense AI Service — Time-Series Feature Engineering (Stage 5)
================================================================
Constructs causal, non-leaking temporal features for agricultural price forecasting.
Guarantees:
- Strict chronological order
- All rolling statistics and lags computed strictly on past observations (forecast origin)
- Rolling window features computed on shifted series (no lookahead bias)
- Chronological split: Train (70%) -> Validation (15%) -> Untouched Test (15%)
- No random time-series splitting
"""

import logging
from typing import Dict, List, Optional, Tuple

import numpy as np
import pandas as pd

logger = logging.getLogger(__name__)


class PriceFeatureEngineer:
    """
    Generates causal time-series features per market-commodity series.
    """

    def __init__(
        self,
        lag_days: Optional[List[int]] = None,
        rolling_windows: Optional[List[int]] = None,
        target_col: str = "modal_price",
    ):
        self.lag_days = lag_days or [1, 3, 7, 14, 30]
        self.rolling_windows = rolling_windows or [7, 14, 30]
        self.target_col = target_col

    def create_features_for_series(self, df_series: pd.DataFrame) -> pd.DataFrame:
        """
        Processes a single homogeneous time-series (e.g. Bengaluru - Tomato).
        """
        df = df_series.copy()
        df["observation_date"] = pd.to_datetime(df["observation_date"])
        df = df.sort_values("observation_date").reset_index(drop=True)

        # 1. Calendar Features
        df["day_of_week"] = df["observation_date"].dt.dayofweek
        df["month"] = df["observation_date"].dt.month
        df["quarter"] = df["observation_date"].dt.quarter
        df["day_of_year"] = df["observation_date"].dt.dayofyear
        df["is_weekend"] = (df["day_of_week"] >= 5).astype(int)

        # 2. Historical Price Lags (Strictly Past Values)
        for lag in self.lag_days:
            df[f"price_lag_{lag}"] = df[self.target_col].shift(lag)

        # 3. Rolling Window Statistics (Shifted by 1 to prevent current-day leakage)
        shifted_target = df[self.target_col].shift(1)
        for w in self.rolling_windows:
            df[f"rolling_mean_{w}"] = shifted_target.rolling(window=w, min_periods=max(2, w // 3)).mean()
            df[f"rolling_std_{w}"] = shifted_target.rolling(window=w, min_periods=max(2, w // 3)).std()
            df[f"rolling_min_{w}"] = shifted_target.rolling(window=w, min_periods=max(2, w // 3)).min()
            df[f"rolling_max_{w}"] = shifted_target.rolling(window=w, min_periods=max(2, w // 3)).max()

        # 4. Volatility and Momentum Ratios
        df["price_momentum_7"] = df["price_lag_1"] / (df["rolling_mean_7"] + 1e-6)
        df["price_volatility_ratio_7"] = df["rolling_std_7"] / (df["rolling_mean_7"] + 1e-6)

        # 5. Price Spread (High - Low) lagged
        if "max_price" in df.columns and "min_price" in df.columns:
            df["price_spread_lag_1"] = (df["max_price"] - df["min_price"]).shift(1)

        # 6. Arrival Quantity Lags if present
        if "arrival_quantity" in df.columns and df["arrival_quantity"].notnull().any():
            df["arrival_lag_1"] = df["arrival_quantity"].shift(1)
            df["arrival_rolling_mean_7"] = (
                df["arrival_quantity"].shift(1).rolling(window=7, min_periods=2).mean()
            )

        return df

    def transform_all_series(self, canonical_df: pd.DataFrame) -> pd.DataFrame:
        """
        Groups by (state, market, commodity, variety) and generates features across all series.
        """
        group_cols = ["state", "market", "commodity", "variety"]
        available_groups = [c for c in group_cols if c in canonical_df.columns]

        processed_dfs: List[pd.DataFrame] = []
        for _, group in canonical_df.groupby(available_groups):
            if len(group) >= 5:
                feat_df = self.create_features_for_series(group)
                processed_dfs.append(feat_df)
            else:
                processed_dfs.append(group)

        if not processed_dfs:
            return pd.DataFrame()

        result = pd.concat(processed_dfs, ignore_index=True)
        return result.sort_values(["observation_date", "market", "commodity"]).reset_index(drop=True)

    @staticmethod
    def chronological_split(
        df: pd.DataFrame,
        train_ratio: float = 0.70,
        val_ratio: float = 0.15,
    ) -> Tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame]:
        """
        Splits dataset strictly chronologically into Train, Validation, and Untouched Test sets.
        Ensures NO data leakage from the future into the past.
        """
        df_sorted = df.sort_values("observation_date").reset_index(drop=True)
        n = len(df_sorted)

        train_end = int(n * train_ratio)
        val_end = int(n * (train_ratio + val_ratio))

        train_df = df_sorted.iloc[:train_end].copy()
        val_df = df_sorted.iloc[train_end:val_end].copy()
        test_df = df_sorted.iloc[val_end:].copy()

        logger.info(
            f"Chronological split: Train={len(train_df)} ({train_df['observation_date'].min()} to {train_df['observation_date'].max()}), "
            f"Val={len(val_df)} ({val_df['observation_date'].min()} to {val_df['observation_date'].max()}), "
            f"Test={len(test_df)} ({test_df['observation_date'].min()} to {test_df['observation_date'].max()})"
        )

        return train_df, val_df, test_df

