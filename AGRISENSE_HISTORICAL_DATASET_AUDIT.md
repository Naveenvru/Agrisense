# AgriSense Historical Dataset Audit

**Audit date:** 2026-10-31  
**Scope:** Read-only inventory and assessment of datasets and model artifacts in this repository. No dataset, model, MongoDB collection, or backend code was modified for this audit.

## Executive recommendation

**There is no verified, training-ready historical price dataset in the repository.** The best candidate mentioned by the notebook is an AGMARKNET-style Jind CSV stored in a Colab/Google Drive location, but the raw CSV itself is not present here. The local `agrisense_cleaned_dataset.csv` and its model outputs have serious provenance and consistency problems and should not be treated as historical observations or evidence of model performance until their source is established.

The notebook's embedded execution record reports that it loaded 10,819 records from the external Jind CSV. That captured run has no arrival-quantity values, creates an empty feature panel, and trains no models. In contrast, the checked-in cleaned CSV has 520 smooth, complete daily rows and the checked-in evaluation CSV reports models trained on 18-row test sets. The local cleaned file also disagrees with the notebook's printed source sample for the same Tomato/Jind/date key. These artifacts do not reconcile to one auditable run.

## 1. Discovery and inventory

The repository scan covered `.csv`, `.parquet`, `.xlsx`, `.xls`, `.json`, `.jsonl`, `.pkl`, `.joblib`, `.feather`, and `.txt` files, while excluding `.git`, `node_modules`, build outputs, virtual environments, and caches. Git-tracked dataset candidates were checked as well. `datasets/` contains four empty directories (`agriculture-documents/`, `crop-prices/`, `disease-detection/`, `weather/`). No local Parquet, Excel, JSONL, pickle, or Feather dataset was found. The `.json` files are application/package configuration files, not agricultural data. `ai-service/requirements.txt` is empty.

| File | Size | Rows × columns | Classification | Key finding |
|---|---:|---:|---|---|
| `agrisense_outputs/agrisense_cleaned_dataset.csv` | 65,667 B | 520 × 20 | I — processed price candidate / G — possible training input | Four market/commodity series; all 520 arrival values missing; provenance absent and values suspiciously regular. |
| `agrisense_outputs/agrisense_supply_analysis.csv` | 86,359 B | 520 × 23 | I — derived analysis | Same 520 keys and identical price values as the cleaned CSV; not an independent dataset. Arrival-derived features are unavailable. |
| `agrisense_outputs/agrisense_forecast.csv` | 1,114 B | 7 × 7 | H — model prediction output | Forecast dates are 2025-05-11 to 2025-05-17; all assumed arrivals missing. It is stale relative to this audit. |
| `agrisense_outputs/agrisense_model_evaluation.csv` | 1,917 B | 12 × 11 | H — evaluation output | Four series × three models, 18 test rows each. It conflicts with the notebook's captured run, which trained no model. |
| `agrisense_outputs/agrisense_msp_report.csv` | 2 B | 0 × 0 | I — empty output | Contains no header or data rows. |
| `agrisense_outputs/agrisense_msp_scenario_analysis.csv` | 1,144 B | 6 × 10 | I — hypothetical scenario output | Six purchase scenarios; arrivals and MSP are missing, so scenario outcomes are blank. Not a price dataset. |
| `agrisense_outputs/agrisense-price-model-20261014T123641Z.joblib` | 1,212,662 B | N/A | G/H — serialized model bundle | Model artifact, not a dataset. Not deserialized during this audit. Its timestamp differs from the notebook's embedded run output. |
| `Agrisense notebook.ipynb` | 385,498 B | 38 cells | I — processing/training workflow and execution record | Captured output identifies an external raw source and reports a different dataset size and run state. |

### External source recorded in the notebook, not present in the repository

The notebook output says it selected:

`/content/drive/MyDrive/agrisense_project/JIND_Variety-wise Daily Market Prices Data of Commodity (1).csv`

The CSV is not in the repository or the scanned `datasets/` directories. Only the notebook's saved output is available, so the original file cannot be re-parsed, independently hashed, or compared row-for-row. The notebook output reports **10,819 × 11**, dates **2025-01-01–2026-04-20**, **471 distinct dates**, **41 commodities**, **14 markets**, one state (Haryana), one district (Jind), no missing fields, and zero exact full-row duplicates. It reports numeric ranges of ₹70–₹20,000 for minimum price, ₹120–₹20,000 for maximum price, and ₹120–₹20,000 for modal price; the notebook itself says the price unit was assumed to be `Rs/quintal`, not read from a source metadata field.

The saved notebook reports **64 repeated daily keys** when grouping by commodity/state/district/market/date. Since the raw file has 44 varieties and 8 grades, these are potential variety/grade records, not automatically duplicates. The notebook's series key omits variety and grade, then averages prices and sums arrivals within a daily group; that aggregation needs explicit review before use.

## 2. Local file schemas and measured quality

### `agrisense_cleaned_dataset.csv`

Columns and pandas-inferred types:

| Column | Type | Missing |
|---|---|---:|
| state | object | 0 |
| district | object | 0 |
| market | object | 0 |
| commodity | object | 0 |
| Variety | object | 0 |
| Grade | object | 0 |
| date | object | 0 |
| min_price | int64 | 0 |
| max_price | int64 | 0 |
| modal_price | float64 | 0 |
| Commodity_Code | int64 | 0 |
| record_id | int64 | 0 |
| flag_invalid_date | bool | 0 |
| flag_invalid_modal_price | bool | 0 |
| arrival_qty | float64 | **520** |
| flag_invalid_arrival_qty | bool | 0 |
| flag_min_gt_modal | bool | 0 |
| flag_modal_gt_max | bool | 0 |
| flag_price_outlier_iqr | bool | 0 |
| flag_arrival_outlier_iqr | bool | 0 |

Coverage is 130 observations each for Potato/Jind, Potato/Narwana, Tomato/Jind, and Tomato/Narwana, all labelled Haryana/Jind, from **2025-01-01 through 2025-05-10**. Each series has one record for every calendar day. There are zero exact duplicates and zero duplicates on the full state/district/market/commodity/variety/grade/date key. All prices are positive and satisfy `min_price ≤ modal_price ≤ max_price`; no invalid-date, modal-price, price-range, or IQR price flags are set. Price ranges are: min 1,207–2,294; modal 1,307.10–2,394.08; max 1,427–2,514. No unit or provider field exists.

**Provenance/regularity warning:** the four series have the same day-to-day modal-price changes to floating-point precision, and each series is complete for exactly 130 days. The first local Tomato/Jind row is 2025-01-01 with min/max/modal 1,300/1,520/1,400. The notebook's printed raw Tomato/Jind row for that date is 1,200/2,000/1,800. This does not prove how the local rows were produced, but it is a strong mismatch and synthetic-pattern signal. The `record_id` values are sequential row numbers created by the notebook code, not provider record IDs.

### `agrisense_supply_analysis.csv`

The 23 columns are `commodity`, `state`, `district`, `market`, `date`, `arrival_qty`, `modal_price`, `min_price`, `max_price`, `source_records`, `invalid_arrival_records`, `price_outlier_records`, `arrival_outlier_records`, `month`, `day_of_week`, `season`, `series_label`, `arrival_ma_7_obs`, `arrival_ma_30_obs`, `arrival_change`, `arrival_pct_change`, `arrival_alert`, and `price_arrival_corr_to_date`.

It has 520 rows, four series and the same dates as the cleaned CSV. `arrival_qty` and all four numeric arrival-derived features (`arrival_ma_7_obs`, `arrival_ma_30_obs`, `arrival_change`, `arrival_pct_change`, `price_arrival_corr_to_date`) are missing for all 520 rows. All `arrival_alert` values say `Arrival quantity unavailable`. Its 520 location/commodity/date keys match the cleaned dataset exactly and min/max/modal prices match on every key. Treat it as a derivative view, never append it to the cleaned data.

### Other CSV outputs

| File | Columns / type notes | Missing / duplicates / date coverage |
|---|---|---|
| `agrisense_forecast.csv` | `series_label` (object), `forecast_date` (object), `predicted_modal_price` (float), `assumed_arrival_qty` (float), `arrival_assumption` (object), `model` (object), `model_version` (object). | 7 rows; zero exact duplicates; 7/7 assumed arrivals missing; forecast period 2025-05-11–17. Version is `agrisense-price-model-20261014T123641Z`. |
| `agrisense_model_evaluation.csv` | `commodity`, `state`, `district`, `market`, `series_label`, `model`, `status` (object); `MAE`, `RMSE`, `R2` (float); `test_rows` (int). | 12 rows; zero exact duplicates; four series and three models, all marked evaluated, each with 18 test rows. No date or dataset/version reference. |
| `agrisense_msp_report.csv` | No parsed columns. | Empty/blank output (2 bytes); no rows to analyze. |
| `agrisense_msp_scenario_analysis.csv` | `series_label`, current/assumed values, scenario flags and `assumption_note`; numeric measures inferred as float. | 6 rows; zero exact duplicates; current arrivals and MSP are each missing on all rows; derived scenario outcome fields are also missing. |

The local evaluation file's median results are: last-observed baseline **MAE 18.474, RMSE 24.972, R² 0.7166**; Random Forest **MAE 24.708, RMSE 34.514, R² 0.4587**; seven-observation rolling baseline **MAE 45.361, RMSE 50.816, R² −0.1735**. The simple last-observation baseline outperforms Random Forest in all four series. These metrics are not evidence of real-world performance because the input/output run provenance is unresolved and the local values are anomalously regular.

## 3. Classification of discovered files

| Category | Findings |
|---|---|
| A — Historical agricultural market prices | The cleaned CSV is shaped like prices but is unverified and anomalously regular. The raw Jind AGMARKNET-style file is only referenced in notebook output and unavailable locally. |
| B — Market arrivals | No populated arrival dataset found. `arrival_qty` is entirely null in the local cleaned and supply outputs; the notebook says source mapping was unavailable. |
| C/D — Weather observations/forecasts | No weather dataset found in the repository. Notebook output lists external Drive candidates `weather-1.csv` and `weather_data.csv`; they were not loaded as the selected price input and are not local files. |
| E/F — Commodity/crop information | No standalone commodity or crop dataset found. `Commodity_Code` is a field in the price candidate, not an independently documented lookup dataset. |
| G — ML training datasets/model artifacts | No verified training dataset. The cleaned CSV is only a candidate; the `.joblib` file is a serialized model artifact, not training data. |
| H — Model predictions/evaluations | `agrisense_forecast.csv` and `agrisense_model_evaluation.csv`. |
| I — Intermediate/processed datasets | `agrisense_cleaned_dataset.csv`, `agrisense_supply_analysis.csv`, MSP scenario output, blank MSP report, and the notebook. |
| J — Unrelated/unusable | No unrelated tabular data file was found. Package/config JSON and the empty requirements file are not datasets. |

## 4. Dataset comparison and duplicate assessment

| Comparison | Result |
|---|---|
| Cleaned vs. supply analysis | Same 520 business keys and identical price values; exact derived overlap is 520/520. Do not concatenate. |
| Cleaned vs. forecast/evaluation/scenario | These are outputs, not observations. Forecast dates start the day after the cleaned file ends; evaluation has no source-data/version key. |
| Local cleaned vs. notebook's selected raw file | Cannot compare whole files because the raw Drive CSV is absent. The notebook's printed Tomato/Jind/2025-01-01 source row disagrees with the local cleaned row for the same key. |
| Notebook-reported duplicate daily keys | 64 groups repeat on commodity/state/district/market/date. Inspect Variety and Grade before classifying these as duplicates or aggregating them. |
| Cross-provider duplicates with future Mandi API records | Not measurable yet. Existing local records lack provider identity and stable source record IDs. The integer `record_id` is run-local row numbering, not a reliable cross-provider key. |

For future comparisons, use a logical identity that includes **source provider**, state, district, market, commodity, variety, grade, and arrival date, with explicit null handling. Compare normalized numeric prices and source payloads separately. Do not collapse two providers' records merely because their market/date/commodity keys match; preserve both provenance records and resolve conflicting values through a documented source policy.

## 5. Mandi API compatibility

The documented response fields map cleanly to the canonical price fields: `state`, `district`, `market`, `commodity`, optional `variety`/`grade`, `arrival_date`, `min_price`, `max_price`, `modal_price`, and `fetched_at`. The API response has no documented arrival quantity or stable source record ID. The AgriSense adapter stores provider source identity and the raw provider payload; it must not invent an arrival quantity or use the local sequential `record_id` as an API key.

| Local field | API field | Compatibility / handling |
|---|---|---|
| `state`, `district`, `market`, `commodity` | Same names | Direct after whitespace/case and reviewed market/commodity alias normalization. Local market names (`Jind`, `Narwana`) may differ from provider labels such as APMC-qualified names; do not fuzzy-merge without a reviewed alias. |
| `Variety`, `Grade` | `variety`, `grade` | Case-only rename; API may omit/null these fields. Keep null distinct from a known value and include source in identity. |
| `date` (ISO in local output; raw notebook input used `DD/MM/YYYY`) | `arrival_date` (documented ISO date) | Parse the original format using source-specific rules and store canonical ISO date. |
| `min_price`, `max_price`, `modal_price` | `min_price`, `max_price`, `modal_price` | Direct numeric mapping after validating strings/numeric ranges. Neither source's local file has an explicit unit column. The notebook assumes Rs/quintal; verify before merging. |
| `arrival_qty` | No documented field | Missing in the source export and API schema. Keep null; do not fill, forward-fill, or treat as zero for training. |
| No trustworthy local equivalent | `fetched_at` | Preserve as provider retrieval timestamp. Keep separate from AgriSense `collectedAt`/ingestion time. |
| `record_id` | No documented record ID | Notebook code creates it with `arange`; not stable across file order or refresh. Keep as an import-row reference only. |
| No local equivalent | Provider/source identity | Add and preserve `source_provider`; retain raw source row/hash and import/collection batch metadata. |

Direct calls to the documented `/v1/states`, `/v1/markets?state=Karnataka`, and `/v1/prices?state=Karnataka` endpoints could not be opened by the available web reader, so no live record comparison or overlap count was possible. The API documentation page displayed an “API Live (80ms)” status at audit time; that page indicator is not a substitute for observing and validating actual response records. The upstream docs state keyless access and a 100 requests / 15 minutes / IP limit. See [Mandi API documentation](https://mandi-api.vercel.app/docs) and [repository README](https://github.com/shrinivas-sn/mandi-api).

## 6. ML suitability

| Use case | Current assessment | Reason |
|---|---|---|
| Commodity-level forecasting | Not ready | A single statewide/commodity aggregate would need a reviewed aggregation rule and source-quality controls. Current local prices have unexplained regularity and no provenance. |
| Market-specific forecasting | Not ready from verified files | Local candidate has only 130 daily records per series and suspect copied price trajectories. Notebook-reported raw source is sparse by series and not locally available. |
| Seven-day forecast | Not demonstrated | The tracked forecast is dated May 2025. Notebook code trains a one-step target recursively, but the captured raw-source run generated an empty feature panel and no trained model. |
| Weather-assisted forecast | Not feasible from current repository data | No local weather observation dataset was found and no verified location/date join is available. Keep weather as a separately sourced dataset keyed by location and observation date. |
| Arrival-assisted forecast | Not feasible from these files | Arrival quantity is absent throughout the local rows and unavailable in the documented price response. Current notebook features require arrival lags/rolling values and drop rows with missing features, which explains the empty feature panel in the captured run. |

The notebook's saved execution output says the feature panel is empty and “No series had enough data for ML training.” The feature builder requires arrival lag and rolling features, then drops rows missing any feature; with no arrivals, this removes every row. It must be redesigned for price-only input (or supplied with real, compatible arrival observations) before the Mandi API can support training.

There is also a validation leakage issue in the notebook: it splits train/validation/test, but the captured training code does not use the validation segment to select a model. Instead, it chooses the best candidate by MAE on the test set, then reuses that test set for reported performance. Reserve the test period for one final evaluation and select/tune on validation data. For a seven-day horizon, apply a time gap/embargo and evaluate all seven horizons, not only one-step performance.

## 7. Recommended source and preprocessing plan

1. **Do not select the local cleaned CSV as the production training source yet.** First obtain the exact raw CSV named in the notebook's captured output and record its source URL/export date, retrieval time, license/terms, checksum, and immutable source file path.
2. Treat the external Jind raw CSV as the most promising candidate currently evidenced, not as a verified training-ready file. Re-run the audit directly against that file. Confirm unit, provider, market names, variety/grade semantics, repeated daily keys, and reporting frequency.
3. Keep original AGMARKNET/API files immutable under a raw source partition. Produce separate normalized/quality-flagged outputs with a source manifest, schema version, import timestamp, and parser version.
4. Normalize field names, parse dates using source-specific formats, validate prices, retain all unusual values with flags, and maintain reviewed commodity/market alias tables. Do not silently convert units or merge unresolved market aliases.
5. Preserve provider identity and raw record provenance. Use exact duplicate detection within a provider and logical-conflict reports across providers. Keep source observations when providers disagree; apply a documented selection or reconciliation policy to the modeling view.
6. Keep variety and grade in the series key or document an intentional aggregation policy. Do not aggregate arrivals or average prices across varieties/grades by default.
7. For price-only Mandi records, remove arrival features from the model contract or collect real arrival data from a compatible provider. Do not impute arrivals with zero or last-observed values unless an explicit, separately evaluated assumption is requested.
8. Sort chronologically and split by time. Use train → validation → untouched test windows with horizon-aware gaps. Compare naïve last price and seasonal/rolling baselines against any learned model. Report per-series observation count, gaps, forecast horizon metrics, and model version.
9. Join weather only from actual observations using documented coordinates/area and observation dates; keep forecasts separate from observations and preserve provider, variable, unit, timestamp, and quality metadata.

## 8. Canonical model-ready schema

| Field | Recommendation |
|---|---|
| `observation_date` | Required; normalized market reporting/arrival date, not retrieval date. |
| `state`, `district`, `market`, `commodity` | Required for market-level series; retain source labels in raw data. |
| `variety`, `grade` | Nullable; preserve rather than silently aggregate. |
| `min_price`, `max_price`, `modal_price` | Numeric and validated; require explicit `price_unit` (e.g., Rs/quintal only after source confirmation). |
| `arrival_quantity` | Nullable and omitted from price-only feature sets unless real observations exist; add `arrival_unit` when present. |
| `source_provider` | Required for every record. |
| `source_record_id` | Nullable only when a provider supplies a stable identifier; never substitute the notebook's sequential row number. |
| `source_retrieved_at` | Provider's own timestamp such as `fetched_at`, when supplied. |
| `ingested_at`, `source_file`, `source_row`, `raw_record_hash`, `quality_flags` | AgriSense provenance and reproducibility fields; keep distinct from reported observation time. |

Keep weather in a separate observation table/dataset with coordinates or a reviewed geography key, observation date/time, provider, variable, original/normalized units, and quality flags. Join it only after spatial and temporal alignment are defined.

## 9. Final decision

- **Best verified repository training dataset:** None.
- **Most promising source candidate:** The external Jind AGMARKNET-style CSV referenced by the notebook's saved output, after it is obtained locally and re-audited.
- **Combine files now?** No. The cleaned and supply CSVs are duplicate views of the same rows; the raw candidate is absent; the forecast/evaluation/scenario files are outputs; provider provenance is missing.
- **Market-specific seven-day ML:** Not supportable from verified repository records. Additional provenance-verified, sufficiently frequent historical data is needed, and the current arrival-dependent feature pipeline cannot train on price-only inputs.
- **Next safe step:** Provide or place the exact raw source CSV into `datasets/crop-prices/` with its source/license note. Then audit that file directly and revise the training-data decision before any merge or model retraining.
