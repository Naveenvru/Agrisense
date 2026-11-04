"""
AgriSense AI Service — Agricultural Exploratory Data Analysis (Stage 4)
=======================================================================
Generates rigorous statistical evaluations and visualizations for market data:
- State & district coverage
- Price distribution by commodity
- Historical price trends and volatility
- Monthly/seasonal patterns
- Saves figures and Markdown report to reports/eda/
"""

import json
import logging
from pathlib import Path
from typing import Dict, List, Optional

import matplotlib
matplotlib.use("Agg")  # Non-interactive backend
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import seaborn as sns

logger = logging.getLogger(__name__)


class MarketEDA:
    """
    Automated EDA generator for canonical agricultural market datasets.
    """

    def __init__(self, canonical_df: pd.DataFrame, output_dir: Optional[Path] = None):
        self.df = canonical_df.copy()
        self.df["observation_date"] = pd.to_datetime(self.df["observation_date"], errors="coerce")
        self.output_dir = output_dir or Path("reports/eda")
        self.output_dir.mkdir(parents=True, exist_ok=True)

    def run_full_eda(self) -> Dict[str, str]:
        """
        Executes all EDA analyses and saves figures and reports.
        """
        generated_files = {}

        # 1. Price Distribution Chart
        fig, ax = plt.subplots(figsize=(10, 6))
        sns.boxplot(
            data=self.df,
            x="commodity",
            y="modal_price",
            hue="market",
            ax=ax,
            palette="Set2",
        )
        ax.set_title("Modal Price Distribution by Commodity & Mandi (₹/Quintal)", fontsize=14, pad=12)
        ax.set_xlabel("Commodity", fontsize=11)
        ax.set_ylabel("Modal Price (₹/Quintal)", fontsize=11)
        plt.tight_layout()
        dist_path = self.output_dir / "price_distribution.png"
        fig.savefig(dist_path, dpi=150)
        plt.close(fig)
        generated_files["price_distribution"] = str(dist_path)

        # 2. Historical Price Trends
        fig, ax = plt.subplots(figsize=(12, 6))
        for (comm, mkt), grp in self.df.groupby(["commodity", "market"]):
            grp_sorted = grp.sort_values("observation_date")
            ax.plot(
                grp_sorted["observation_date"],
                grp_sorted["modal_price"],
                label=f"{comm} ({mkt})",
                linewidth=1.8,
            )
        ax.set_title("Historical Modal Price Trends Over Time", fontsize=14, pad=12)
        ax.set_xlabel("Observation Date", fontsize=11)
        ax.set_ylabel("Modal Price (₹/Quintal)", fontsize=11)
        ax.legend(loc="upper left")
        ax.grid(True, linestyle="--", alpha=0.5)
        plt.tight_layout()
        trend_path = self.output_dir / "price_trends.png"
        fig.savefig(trend_path, dpi=150)
        plt.close(fig)
        generated_files["price_trends"] = str(trend_path)

        # 3. Monthly Volatility Analysis
        self.df["month_year"] = self.df["observation_date"].dt.to_period("M").astype(str)
        monthly_stats = (
            self.df.groupby(["commodity", "month_year"])["modal_price"]
            .agg(
                mean_price="mean",
                std_price="std",
                min_price="min",
                max_price="max",
                obs_count="count",
            )
            .reset_index()
        )
        monthly_stats["volatility_cv"] = (
            monthly_stats["std_price"] / (monthly_stats["mean_price"] + 1e-6)
        ).round(4)
        vol_csv = self.output_dir / "monthly_price_volatility.csv"
        monthly_stats.to_csv(vol_csv, index=False)
        generated_files["volatility_csv"] = str(vol_csv)

        # 4. Generate Comprehensive Markdown Summary
        summary_md_path = self.output_dir / "eda_summary.md"
        with open(summary_md_path, "w", encoding="utf-8") as f:
            f.write("# AgriSense — Agricultural Market Exploratory Data Analysis\n\n")
            f.write(f"- Total Records Analyzed: **{len(self.df)}**\n")
            f.write(
                f"- Temporal Range: **{self.df['observation_date'].min().date()}** to **{self.df['observation_date'].max().date()}**\n"
            )
            f.write(f"- States Represented: {', '.join(self.df['state'].unique())}\n")
            f.write(f"- Markets Represented: {', '.join(self.df['market'].unique())}\n")
            f.write(f"- Commodities: {', '.join(self.df['commodity'].unique())}\n\n")

            f.write("## Monthly Summary Statistics\n\n")
            f.write("```csv\n")
            f.write(monthly_stats.to_csv(index=False))
            f.write("```\n")
            f.write("\n\n## Visualizations Generated\n\n")
            f.write("- `price_distribution.png`: Boxplot of prices across mandis\n")
            f.write("- `price_trends.png`: Longitudinal modal price trajectories\n")
            f.write("- `monthly_price_volatility.csv`: Coefficient of variation and dispersion\n")

        generated_files["summary_report"] = str(summary_md_path)
        logger.info(f"Full EDA completed. Assets saved to {self.output_dir}")
        return generated_files
