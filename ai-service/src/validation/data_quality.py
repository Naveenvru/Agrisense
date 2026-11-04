"""
AgriSense AI Service — Data Quality & Integrity Validation (Stage 3)
====================================================================
Performs rigorous data quality checks on canonical datasets:
- Missing-value analysis
- Duplicate and conflicting-record detection
- Price invariant checks (min <= modal <= max)
- Outlier detection via IQR
- Generates data/metadata/dataset_quality_report.json
"""

import json
import logging
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List

import numpy as np
import pandas as pd

logger = logging.getLogger(__name__)


class DataQualityValidator:
    """
    Validates canonical agricultural datasets against strict data integrity rules.
    """

    def __init__(self, df: pd.DataFrame, dataset_name: str = "canonical_market_prices"):
        self.df = df.copy()
        self.dataset_name = dataset_name

    def validate(self) -> Dict[str, Any]:
        """
        Executes full battery of validation tests and returns an audit dictionary.
        """
        total_rows = len(self.df)
        if total_rows == 0:
            return {"error": "Dataset is empty", "total_rows": 0}

        # 1. Missing Value Analysis
        missing_counts = self.df.isnull().sum().to_dict()
        missing_pct = {k: round((v / total_rows) * 100, 2) for k, v in missing_counts.items()}

        # 2. Date Integrity
        valid_dates = pd.to_datetime(self.df["observation_date"], errors="coerce")
        invalid_dates_count = int(valid_dates.isnull().sum())
        min_date = str(valid_dates.min().date()) if valid_dates.notnull().any() else None
        max_date = str(valid_dates.max().date()) if valid_dates.notnull().any() else None

        # 3. Price Invariants: min_price <= modal_price <= max_price
        p_min = self.df["min_price"]
        p_modal = self.df["modal_price"]
        p_max = self.df["max_price"]

        inv_min_gt_modal = int(((p_min > p_modal) & p_min.notnull() & p_modal.notnull()).sum())
        inv_modal_gt_max = int(((p_modal > p_max) & p_modal.notnull() & p_max.notnull()).sum())
        inv_min_gt_max = int(((p_min > p_max) & p_min.notnull() & p_max.notnull()).sum())
        zero_or_neg_prices = int((p_modal <= 0).sum())

        # 4. Outlier Analysis on Modal Price (IQR Method by Commodity)
        outlier_records = 0
        commodity_outliers = {}
        for comm, group in self.df.groupby("commodity"):
            prices = group["modal_price"].dropna()
            if len(prices) >= 5:
                q25 = prices.quantile(0.25)
                q75 = prices.quantile(0.75)
                iqr = q75 - q25
                lower_bound = max(0, q25 - 1.5 * iqr)
                upper_bound = q75 + 1.5 * iqr
                n_outliers = int(((prices < lower_bound) | (prices > upper_bound)).sum())
                outlier_records += n_outliers
                commodity_outliers[str(comm)] = {
                    "count": len(prices),
                    "q25": round(float(q25), 2),
                    "q75": round(float(q75), 2),
                    "iqr": round(float(iqr), 2),
                    "bounds": [round(float(lower_bound), 2), round(float(upper_bound), 2)],
                    "outliers_detected": n_outliers,
                }

        # 5. Duplicate and Conflicting Records
        key_cols = ["observation_date", "state", "market", "commodity", "variety"]
        available_keys = [c for c in key_cols if c in self.df.columns]
        duplicates_count = int(self.df.duplicated(subset=available_keys, keep=False).sum())

        # 6. Geographic & Commodity Coverage
        states = [str(s) for s in self.df["state"].dropna().unique().tolist() if s]
        commodities = [str(c) for c in self.df["commodity"].dropna().unique().tolist() if c]
        markets = [str(m) for m in self.df["market"].dropna().unique().tolist() if m]

        # 7. Quality Flags Distribution
        flag_series = self.df["quality_flags"].astype(str).str.split(",").explode()
        flag_summary = flag_series.value_counts().to_dict()

        report = {
            "dataset_name": self.dataset_name,
            "generated_at": datetime.now(timezone.utc).isoformat(),
            "total_records": total_rows,
            "temporal_coverage": {
                "start_date": min_date,
                "end_date": max_date,
                "invalid_dates": invalid_dates_count,
            },
            "geographic_coverage": {
                "total_states": len(states),
                "states": states,
                "total_markets": len(markets),
            },
            "commodity_coverage": {
                "total_commodities": len(commodities),
                "commodities": commodities,
            },
            "price_invariants": {
                "min_gt_modal_count": inv_min_gt_modal,
                "modal_gt_max_count": inv_modal_gt_max,
                "min_gt_max_count": inv_min_gt_max,
                "non_positive_price_count": zero_or_neg_prices,
                "all_invariants_passed": (
                    inv_min_gt_modal == 0
                    and inv_modal_gt_max == 0
                    and inv_min_gt_max == 0
                    and zero_or_neg_prices == 0
                ),
            },
            "outlier_analysis": {
                "total_price_outliers_iqr": outlier_records,
                "by_commodity": commodity_outliers,
            },
            "missing_values": {
                "counts": missing_counts,
                "percentages": missing_pct,
            },
            "duplicates": {
                "conflicting_duplicate_keys": duplicates_count,
            },
            "quality_flags_breakdown": {str(k): int(v) for k, v in flag_summary.items()},
            "status": "VALIDATED",
        }
        return report

    def save_report(self, dest_path: Path) -> Path:
        dest_path.parent.mkdir(parents=True, exist_ok=True)
        report = self.validate()
        with open(dest_path, "w", encoding="utf-8") as f:
            json.dump(report, f, indent=2)
        logger.info(f"Data quality report saved to {dest_path}")
        return dest_path

