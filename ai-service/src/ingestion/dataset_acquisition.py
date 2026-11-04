"""
AgriSense AI Service — Dataset Acquisition Engine (Stage 2)
============================================================
Downloads and validates authentic agricultural datasets from Kaggle.

Design rules:
- Never generate synthetic agricultural observations
- Always record dataset provenance (source, license, checksums)
- Never merge datasets without schema validation
- Preserve raw data permanently in data/raw/
- Record SHA-256 checksums for every file
- Support offline re-use of previously downloaded files
"""

import hashlib
import json
import logging
import os
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional

import pandas as pd

logger = logging.getLogger(__name__)

BASE_DIR = Path(__file__).resolve().parent.parent.parent
DATA_DIR = BASE_DIR / "data"
RAW_DIR = DATA_DIR / "raw"
META_DIR = DATA_DIR / "metadata"


def sha256_file(path: Path) -> str:
    """Compute SHA-256 checksum of a file."""
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(65536), b""):
            h.update(chunk)
    return h.hexdigest()


def inspect_csv(path: Path, max_rows: int = 5) -> dict:
    """Inspect a CSV file and return schema information."""
    try:
        df = pd.read_csv(path, nrows=max_rows)
        return {
            "columns": df.columns.tolist(),
            "dtypes": {col: str(dtype) for col, dtype in df.dtypes.items()},
            "sample_rows": df.head(2).to_dict(orient="records"),
        }
    except Exception as e:
        return {"error": str(e)}


def download_kaggle_dataset(
    dataset_slug: str,
    dest_dir: Path,
    force: bool = False,
) -> Optional[Path]:
    """
    Download a Kaggle dataset using kagglehub or kaggle CLI.

    Args:
        dataset_slug: Kaggle dataset identifier (e.g. 'username/dataset-name')
        dest_dir: Local directory to save files
        force: Re-download even if already present

    Returns:
        Path to the downloaded directory, or None on failure
    """
    dest_dir.mkdir(parents=True, exist_ok=True)

    # Check if already downloaded
    existing = list(dest_dir.glob("*.csv")) + list(dest_dir.glob("*.zip"))
    if existing and not force:
        logger.info(f"Dataset already present in {dest_dir} — skipping download")
        return dest_dir

    # Try kagglehub first (preferred)
    try:
        import kagglehub  # type: ignore
        logger.info(f"Downloading {dataset_slug} via kagglehub…")
        path = kagglehub.dataset_download(dataset_slug)
        logger.info(f"Downloaded to {path}")
        return Path(path)
    except ImportError:
        logger.warning("kagglehub not available, trying kaggle CLI…")
    except Exception as e:
        logger.warning(f"kagglehub download failed: {e}")

    # Fallback: kaggle API
    try:
        import kaggle  # type: ignore
        logger.info(f"Downloading {dataset_slug} via kaggle API…")
        kaggle.api.authenticate()
        kaggle.api.dataset_download_files(
            dataset_slug, path=str(dest_dir), unzip=True
        )
        return dest_dir
    except Exception as e:
        logger.error(f"Kaggle API download failed: {e}")
        return None


def build_file_manifest(directory: Path, dataset_id: str, metadata: dict) -> dict:
    """Build a manifest entry for downloaded files."""
    files = []
    for path in sorted(directory.rglob("*")):
        if path.is_file() and not path.name.startswith("."):
            stat = path.stat()
            entry = {
                "filename": path.name,
                "relative_path": str(path.relative_to(directory)),
                "size_bytes": stat.st_size,
                "sha256": sha256_file(path),
            }
            if path.suffix.lower() == ".csv":
                entry["schema"] = inspect_csv(path)
            files.append(entry)

    return {
        "dataset_id": dataset_id,
        "retrieved_at": datetime.now(timezone.utc).isoformat(),
        "source": metadata.get("source", ""),
        "kaggle_slug": metadata.get("kaggle_slug", ""),
        "license": metadata.get("license", ""),
        "description": metadata.get("description", ""),
        "commodity_coverage": metadata.get("commodity_coverage", []),
        "geographic_coverage": metadata.get("geographic_coverage", []),
        "date_coverage": metadata.get("date_coverage", {}),
        "price_units": metadata.get("price_units", []),
        "files": files,
    }


# =============================================================================
# KNOWN DATASETS — discovery targets for Indian agricultural market data
# =============================================================================

DATASET_TARGETS = [
    {
        "id": "agmarknet_daily_prices",
        "description": "Indian AGMARKNET daily commodity prices",
        "kaggle_slug": "amanupadhyay/indian-agricultural-commodity-prices",
        "source": "AGMARKNET",
        "license": "ODbL / CC0 (verify before use)",
        "commodity_coverage": ["Rice", "Wheat", "Tomato", "Onion", "Potato", "Maize"],
        "geographic_coverage": ["India", "Multiple states"],
        "category": "market_prices",
        "dest_dir": RAW_DIR / "prices" / "agmarknet_daily",
    },
    {
        "id": "daily_veg_fruit_prices",
        "description": "Daily vegetable and fruit market prices India",
        "kaggle_slug": "sudalairajkumar/daily-temperature-of-major-cities",
        "source": "Kaggle aggregation",
        "license": "CC0",
        "commodity_coverage": ["Vegetables", "Fruits"],
        "geographic_coverage": ["India"],
        "category": "market_prices",
        "dest_dir": RAW_DIR / "prices" / "daily_veg_fruit",
    },
    {
        "id": "agri_commodity_prices_india",
        "description": "Agricultural commodity prices India — multi-year",
        "kaggle_slug": "akhilesh2604/agriculture-commodity-prices-india",
        "source": "Data.gov.in / AGMARKNET",
        "license": "NLOD (verify)",
        "commodity_coverage": ["Rice", "Wheat", "Pulses", "Oilseeds"],
        "geographic_coverage": ["India — multiple states"],
        "category": "market_prices",
        "dest_dir": RAW_DIR / "prices" / "agri_commodity_india",
    },
    {
        "id": "karnataka_market_prices",
        "description": "Karnataka agricultural market prices",
        "kaggle_slug": "nareshbhat/indian-agricultural-markets",
        "source": "Karnataka State Agricultural Marketing Board",
        "license": "CC0 (verify)",
        "commodity_coverage": ["Tomato", "Onion", "Paddy", "Ragi", "Maize"],
        "geographic_coverage": ["Karnataka"],
        "category": "market_prices",
        "dest_dir": RAW_DIR / "prices" / "karnataka_markets",
    },
    {
        "id": "india_crop_production",
        "description": "State-wise crop production statistics India",
        "kaggle_slug": "abhinand05/crop-production-in-india",
        "source": "ICAR / Ministry of Agriculture",
        "license": "ODbL (verify)",
        "commodity_coverage": ["All major crops"],
        "geographic_coverage": ["India — state-wise"],
        "category": "production",
        "dest_dir": RAW_DIR / "production" / "india_crop_production",
    },
    {
        "id": "plantvillage_disease",
        "description": "PlantVillage crop disease image dataset",
        "kaggle_slug": "abdallahalidev/plantvillage-dataset",
        "source": "PlantVillage Project — Penn State University",
        "license": "CC BY-SA 4.0 (verify)",
        "commodity_coverage": ["Tomato", "Potato", "Pepper", "Rice", "Corn", "Grape", "Apple"],
        "geographic_coverage": ["Global — controlled conditions"],
        "category": "disease_images",
        "dest_dir": RAW_DIR / "plantvillage",
    },
]


def run_discovery(targets: list[dict], download: bool = False) -> dict:
    """
    Discover and optionally download datasets.

    Args:
        targets: List of dataset target definitions
        download: Whether to actually download (False = discovery only)

    Returns:
        Discovery report
    """
    report = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "total_targets": len(targets),
        "downloaded": 0,
        "failed": 0,
        "skipped": 0,
        "datasets": [],
    }

    manifest_path = META_DIR / "dataset_manifest.json"
    META_DIR.mkdir(parents=True, exist_ok=True)

    existing_manifest: list = []
    if manifest_path.exists():
        try:
            with open(manifest_path) as f:
                existing_manifest = json.load(f)
        except Exception:
            existing_manifest = []

    for target in targets:
        logger.info(f"\n{'='*60}")
        logger.info(f"Dataset: {target['id']}")
        logger.info(f"  Description: {target['description']}")
        logger.info(f"  Kaggle slug: {target['kaggle_slug']}")
        logger.info(f"  License: {target['license']}")
        logger.info(f"  Destination: {target['dest_dir']}")

        entry = {
            "dataset_id": target["id"],
            "description": target["description"],
            "kaggle_slug": target["kaggle_slug"],
            "source": target["source"],
            "license": target["license"],
            "commodity_coverage": target["commodity_coverage"],
            "geographic_coverage": target["geographic_coverage"],
            "category": target["category"],
            "status": "not_downloaded",
            "files": [],
        }

        if download:
            path = download_kaggle_dataset(target["kaggle_slug"], target["dest_dir"])
            if path:
                manifest_entry = build_file_manifest(
                    path, target["id"], target
                )
                entry.update(manifest_entry)
                entry["status"] = "downloaded"
                report["downloaded"] += 1
                logger.info(f"  Status: DOWNLOADED — {len(manifest_entry['files'])} files")
            else:
                entry["status"] = "failed"
                report["failed"] += 1
                logger.error(f"  Status: FAILED")
        else:
            entry["status"] = "discovery_only"
            report["skipped"] += 1
            logger.info(f"  Status: DISCOVERY_ONLY (use --download to retrieve)")

        report["datasets"].append(entry)

    # Save manifest
    all_entries = {e["dataset_id"]: e for e in existing_manifest}
    for entry in report["datasets"]:
        all_entries[entry["dataset_id"]] = entry
    with open(manifest_path, "w") as f:
        json.dump(list(all_entries.values()), f, indent=2, default=str)

    # Save inventory CSV
    inventory_rows = []
    for entry in report["datasets"]:
        inventory_rows.append({
            "dataset_id": entry["dataset_id"],
            "description": entry["description"],
            "kaggle_slug": entry["kaggle_slug"],
            "source": entry["source"],
            "license": entry["license"],
            "category": entry["category"],
            "status": entry["status"],
            "file_count": len(entry.get("files", [])),
        })
    if inventory_rows:
        pd.DataFrame(inventory_rows).to_csv(
            META_DIR / "dataset_inventory.csv", index=False
        )

    logger.info(f"\n{'='*60}")
    logger.info(f"Discovery complete:")
    logger.info(f"  Total targets: {report['total_targets']}")
    logger.info(f"  Downloaded: {report['downloaded']}")
    logger.info(f"  Failed: {report['failed']}")
    logger.info(f"  Skipped/Discovery only: {report['skipped']}")
    logger.info(f"  Manifest saved: {manifest_path}")

    return report


if __name__ == "__main__":
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s [%(levelname)s] %(name)s — %(message)s",
    )

    do_download = "--download" in sys.argv
    if not do_download:
        logger.info("Running in DISCOVERY mode (no downloads). Use --download to retrieve datasets.")

    report = run_discovery(DATASET_TARGETS, download=do_download)

    # Print summary
    print(f"\n{'='*60}")
    print("DATASET DISCOVERY REPORT")
    print(f"{'='*60}")
    for ds in report["datasets"]:
        status_icon = "[DOWNLOADED]" if ds["status"] == "downloaded" else "[DISCOVERED]" if ds["status"] == "discovery_only" else "[FAILED]"
        print(f"{status_icon} [{ds['category'].upper()}] {ds['dataset_id']}")
        print(f"   Source: {ds['source']}")
        print(f"   Kaggle: {ds['kaggle_slug']}")
        print(f"   License: {ds['license']}")
        print(f"   Commodities: {', '.join(ds.get('commodity_coverage', []))[:80]}")
        print(f"   Geography: {', '.join(ds.get('geographic_coverage', []))[:80]}")
        print()

