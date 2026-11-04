# AGRISENSE AI ECOSYSTEM — REMAINING WORK & PRODUCTION ROADMAP

**Document Date:** November 4, 2026  
**Status:** Canonical Backlog & Technical Debt Tracking  
**Target Architecture:** AgriSense v11.0 Production Readiness  

---

## 1. PRIORITIZED BACKLOG

### Priority 0: Immediate Pre-Deployment Prerequisites (P0)

1. **Production Database & Infrastructure Provisioning**
   - *Description:* Ensure PostgreSQL (with PostGIS extension) and MongoDB instances are provisioned and accessible via environment variables (`DATABASE_URL`, `MONGODB_URI`).
   - *Impact:* Necessary for persistent farmer profile records, geospatial land polygon storage, and historic mandi price timeseries indexing.
   - *Effort:* 0.5 Days (DevOps / Docker Compose).

2. **API Keys Configuration**
   - *Description:* Set production API credentials in backend and AI service `.env`:
     - `GEMINI_API_KEY`: For generative bilingual agricultural advice and market narrative generation.
     - `OPENWEATHER_API_KEY`: For live weather radar and real-time precipitation alerts.
   - *Impact:* Activates live fallback for generative chatbot and current weather widgets.
   - *Effort:* 0.25 Days.

3. **Background Process Supervisor (Systemd / Docker)**
   - *Description:* Containerize FastAPI microservice (`ai-service`) and NestJS backend (`backend`) using multi-stage Dockerfiles.
   - *Impact:* Guarantees automated restart, resource limits, and health checks in cloud environments.
   - *Effort:* 1 Day.

---

### Priority 1: High-Value AI & Data Enhancements (P1)

4. **Automated Mandi Harvest Pipeline (Cron / Airflow)**
   - *Description:* Deploy a daily scheduled task (`ai-service/scripts/harvest_mandi_daily.py`) to query the `data.gov.in` Mandi Prices API at 18:00 IST daily.
   - *Impact:* Continuously accumulates fresh arrival and modal price records across all 31 Karnataka APMCs.
   - *Effort:* 1.5 Days.

5. **Full PlantVillage Multi-Epoch GPU Training**
   - *Description:* Train `MobileNetV3-Small` or `EfficientNet-B0` across the full 54,306 images of the complete PlantVillage dataset on an NVIDIA GPU (e.g., T4/A10G) for 25 epochs.
   - *Impact:* Elevates test accuracy from baseline ~15-20% (on small sample) to >98% with production-grade generalization.
   - *Effort:* 1 Day (GPU compute).

6. **Dense Sentence-Transformer Vector Upgrade for RAG**
   - *Description:* Upgrade ChromaDB embedding function from `DeterministicAgronomicEmbeddingFunction` (128-dim hashing) to `sentence-transformers/all-MiniLM-L6-v2` or `paraphrase-multilingual-MiniLM-L12-v2` via ONNX runtime.
   - *Impact:* Enables semantic search in Kannada, Hindi, and Indian English vernacular without exact keyword matching.
   - *Effort:* 2 Days.

---

### Priority 2: Operational Optimization & Scaling (P2)

7. **Hummingbird & ONNX Model Export Automation**
   - *Description:* Integrate ONNX runtime model export directly into the model training pipeline (`train_disease_model.py` and `forecasting_pipeline.py`).
   - *Impact:* Lowers inference latency by an additional 30-50% and provides hardware portability across edge devices.
   - *Effort:* 2 Days.

8. **Automated Retraining & Drift Monitoring**
   - *Description:* Implement Evidently AI or Prometheus metrics to monitor forecasting error drift (tracking rolling 7-day MAE) and data distribution shift.
   - *Impact:* Automatically triggers model re-fitting when agricultural market dynamics change due to monsoon shocks.
   - *Effort:* 3 Days.

9. **Field Validation Campaign with Krishi Vigyan Kendras (KVK)**
   - *Description:* Pilot test AgriSense disease detection and price forecasts with 50 local farmers in Kolar and Chikkaballapur districts.
   - *Impact:* Collects authentic smartphone field imagery under diverse lighting and camera qualities for continuous model improvement.
   - *Effort:* 2 Weeks (Field Operations).

---

## 2. TECHNICAL DEBT REGISTER

| Item | Component | Severity | Description | Remediation Plan |
|------|-----------|:--------:|-------------|------------------|
| **TD-01** | `ai-service/data` | Low | Legacy synthetic price dataset (`agrisense_cleaned_dataset.csv`) resides in output folder. | Kept quarantined with explicit `.quarantine` flag; canonical pipeline now exclusively references `data/raw/prices/`. |
| **TD-02** | `ai-service/src/rag` | Medium | Hashing-based embedding function used to eliminate external network dependencies during development. | Upgrade to ONNX-packaged `all-MiniLM-L6-v2` for dense semantic vector retrieval. |
| **TD-03** | `ai-service/models` | Medium | MobileNetV3 trained on a stratified subset (304 images) on CPU. | Execute full 54,000-image training on GPU cluster during scheduled release cycle. |
| **TD-04** | `backend/src/ai` | Low | Direct HTTP communication between NestJS and FastAPI microservice. | Add Redis BullMQ queue for asynchronous batch disease classification jobs. |

---

## 3. PRODUCTION READINESS CHECKLIST

- [x] Authentic Public Datasets Acquired (PlantVillage, PlantDoc, Karnataka APMC, Open-Meteo ERA5, IMD).
- [x] Provenance & License Manifests Documented (`plantvillage_manifest.csv`, `market_dataset_manifest.csv`, `rag_dataset_manifest.csv`).
- [x] Synthetic Data Quarantined & Forensic Audit Documented.
- [x] PyTorch Deep Learning Model Trained with Checkpoint Saved (`models/disease/mobilenetv3_best.pth`).
- [x] Multi-Horizon Forecasting Evaluated on Real Volatile Mandi Data ($h \in \{1, 3, 7, 14, 30\}$).
- [x] Grad-CAM Heatmap Visualization Verified.
- [x] Clinical Uncertainty Gates Implemented (Confidence $< 85\%$ flags expert review).
- [x] RAG Knowledge Base Grounded with 100% Verified ICAR/UAS Citations.
- [x] Inference Latency Benchmarked (< 2ms for forecasting, < 500ms for vision).
- [x] End-to-End Workflows A, B, C, D Integration Tests Passing.
- [x] NestJS Backend Client Integrated & Compiling with 0 Errors.
- [x] React Frontend TypeScript Compiling with 0 Errors.
- [ ] Production Database Environment Provisioned (Pending Cloud Deployment).
- [ ] Production Gemini / OpenWeather API Keys Injected into Deployment Vault.

