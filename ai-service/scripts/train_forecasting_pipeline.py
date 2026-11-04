"""
AgriSense AI Service — End-to-End Forecasting Pipeline Runner
=============================================================
1. Loads canonical market dataset
2. Runs full exploratory data analysis
3. Extracts causal non-leaking time-series features
4. Splits strictly chronologically (Train -> Val -> Test)
5. Benchmarks Ridge, RF, ExtraTrees, GBDT, XGBoost, LightGBM, CatBoost
6. Evaluates best model on untouched test set
7. Saves winning model artifact and metadata
"""

import sys
from pathlib import Path

# Add ai-service to path
ROOT_DIR = Path(__file__).resolve().parent.parent
sys.path.append(str(ROOT_DIR))

import pandas as pd
from src.eda.market_eda import MarketEDA
from src.features.price_features import PriceFeatureEngineer
from src.forecasting.machine_learning.ml_models import PriceForecastingModelSuite


def main():
    print("============================================================")
    print("AGRISENSE AI — FORECASTING PIPELINE EXECUTION")
    print("============================================================")

    # 1. Load canonical data
    canonical_path = ROOT_DIR / "data" / "processed" / "canonical_market_prices.parquet"
    if not canonical_path.exists():
        print(f"Error: {canonical_path} does not exist. Run preprocessor first.")
        sys.exit(1)

    df = pd.read_parquet(canonical_path)
    print(f"1. Loaded canonical dataset: {df.shape}")

    # 2. Run EDA
    eda_out_dir = ROOT_DIR / "reports" / "eda"
    eda = MarketEDA(df, output_dir=eda_out_dir)
    eda_files = eda.run_full_eda()
    print(f"2. EDA completed. Generated assets: {list(eda_files.keys())}")

    # 3. Time-Series Feature Engineering
    fe = PriceFeatureEngineer()
    df_features = fe.transform_all_series(df)
    print(f"3. Feature-engineered dataset: {df_features.shape}")

    # 4. Iterate over major series and train models
    series_groups = [
        ("Tomato", "Jind"),
        ("Potato", "Jind"),
    ]

    leaderboards = []

    for commodity, market in series_groups:
        print(f"\n------------------------------------------------------------")
        print(f"Training models for series: {commodity} @ {market}")
        print(f"------------------------------------------------------------")

        sub_df = df_features[
            (df_features["commodity"] == commodity) & (df_features["market"] == market)
        ].copy()

        if len(sub_df) < 20:
            print(f"Warning: Insufficient samples for {commodity} @ {market}: {len(sub_df)}")
            continue

        train_df, val_df, test_df = fe.chronological_split(sub_df, train_ratio=0.70, val_ratio=0.15)
        print(f"Chronological Splits: Train={len(train_df)}, Val={len(val_df)}, Test={len(test_df)}")

        suite = PriceForecastingModelSuite()
        summary = suite.train_and_benchmark(train_df, val_df, test_df, target_col="modal_price")

        print("\nValidation Leaderboard:")
        for r in summary["validation_leaderboard"]:
            print(
                f"  - {r['model']:<16} : Val MAE = {r['val_mae']:<7.2f} | Val RMSE = {r['val_rmse']:<7.2f} | Val sMAPE = {r['val_smape']:<5.2f}%"
            )

        print(f"\nWinning Model: {summary['best_model']}")
        print(f"Untouched Test Set Evaluation: {summary['test_evaluation']}")

        # Save model artifact
        safe_comm = commodity.lower().replace(" ", "_")
        safe_mkt = market.lower().replace(" ", "_")
        model_path = ROOT_DIR / "artifacts" / "forecasting" / f"price_model_{safe_comm}_{safe_mkt}.joblib"
        suite.save_best_model(model_path, summary)

        for item in summary["validation_leaderboard"]:
            item["commodity"] = commodity
            item["market"] = market
            item["is_best"] = item["model"] == summary["best_model"]
            leaderboards.append(item)

    # Save overall leaderboard CSV
    leaderboard_csv = ROOT_DIR / "data" / "metadata" / "model_evaluation.csv"
    pd.DataFrame(leaderboards).to_csv(leaderboard_csv, index=False)
    print(f"\nOverall evaluation leaderboard saved to {leaderboard_csv}")
    print("Forecasting pipeline successfully executed!")


if __name__ == "__main__":
    main()

