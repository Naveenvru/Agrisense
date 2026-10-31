# AgriSense Master Completion Audit

Audit date: 2026-10-30. This records source-level implementation and local verification. External providers and live database state were not verified.

## Architecture

- Frontend: React, TypeScript, Vite, Tailwind.
- Backend: NestJS, TypeORM/PostgreSQL, Mongoose/MongoDB.
- Integrations present in source: OpenWeather, Gemini, a market collector interface, and abstract notification interfaces. No configured live market collector or concrete WhatsApp/SMS provider was available for verification.
- Backend uses manually maintained SQL schema/migrations; TypeORM synchronization is disabled.

## Completion matrix

| Area | Status | Evidence and remaining work |
|---|---|---|
| Authentication and Google OAuth | IMPLEMENTED, NOT LIVE-VERIFIED | JWT/OAuth and profile APIs exist. No end-to-end auth provider run was available. |
| Farmer profile, parcels, crops, calendar | PARTIAL | Existing APIs now feed farm/calendar views; fabricated health, weather, and crop status values were removed. Several values still display as unknown when source records omit them. |
| Regional market query and UI | PARTIAL | Authenticated UI/API query persisted observations by commodity, market, region, and date. The Mandi API adapter now feeds the existing collector path, but the live service and Karnataka coverage remain unverified. |
| Dashboard | PARTIAL | Market/weather cards use available APIs; fake recommendation and “healthy” claims were removed. Recommendation remains unavailable absent validated evidence. |
| Weather | PARTIAL | Weather page requests current, forecast, and stored history for geolocated parcels. Live provider credentials/network and response freshness were not verified. |
| Crop calendar | PARTIAL | Calendar UI reads registered events and does not invent times, priority, duration, or stages. Risk/planning status remains unavailable without validated data. |
| Disease/crop health | PARTIAL | Existing AI integration remains. Provider/model behavior, confidence calibration, and clinical/agronomic validation were not verified. |
| General settings | PARTIAL, FUNCTIONAL CORE | Theme and accent palettes, Indian locale preference, metric/imperial units, AI consent, password updates, session revocation, account export, and Google account link/unlink now use persisted account APIs. Full translation of all screens, account deletion, and some account-security workflows remain unsupported. |
| Notification preferences and consent | IMPLEMENTED, NOT LIVE-VERIFIED | Persisted preferences, separate WhatsApp/SMS consent, configurable time/timezone, category settings, and explicit consent controls. Kannada is disabled pending verified templates; bilingual preference currently sends English only. |
| Notification scheduling/history | PARTIAL | Timezone-aware persistent daily jobs, idempotency, attempts/history API, and consent-aware WhatsApp-first/SMS-fallback policy exist. A worker, digest-data builder, retry dispatcher, and delivery provider are still needed. Queued jobs are not deliveries. |
| WhatsApp/SMS delivery | BLOCKED BY EXTERNAL DEPENDENCY | No concrete provider, credentials, approved templates/sender registration, DLT configuration, or opt-out webhook is available. No farmer messages were sent. |
| Decision Center / EIE | PARTIAL | Query UI and user-scoped persisted decision traces support a constrained analysis of observed market prices, with stages, source evidence, limitations, and unsupported-query handling. Weather, disease, crop, and predictive questions are not implemented in this workflow. |
| Reports/PDF | PARTIAL | Authenticated report generation/history/download supports available farm, market, weather, calendar, and decision-trace data. PDF rendering and source metadata are tested. Live database-backed report generation was not exercised. |
| Security and isolation | PARTIAL | New history/report/trace endpoints are authenticated and user-scoped in source. Full endpoint-by-endpoint authorization, rate limiting, webhook verification, and production security review remain. |
| Automated verification | VERIFIED LOCALLY | Backend build passed; 11 Jest suites / 17 tests passed. Frontend TypeScript + production Vite build passed. Frontend lint passed with warnings. No frontend test script exists. |

## Added persistence and endpoints

- Migrations: `08_notifications.sql`, `09_decision_traces.sql`, `10_reports.sql`, `11_account_settings.sql`.
- Notification preferences/consent/history: `/notifications/preferences` and `/notifications/preferences/history` plus consent/revoke operations.
- Decision Center: `POST /decision-center/query`, `GET /decision-center/history`, `GET /decision-center/history/:traceId`.
- Reports: `GET /reports`, `POST /reports`, `GET /reports/:id/download`.
- Account settings: `GET/PATCH /settings`, `POST /settings/password`, `GET /settings/export`, and Google link/disconnect operations under `/settings/connections`.
- Apply the migrations before deploying these modules. Existing consolidated schema snapshots were also updated.

## Verification record

- `backend`: `npm run build` passed.
- `backend`: `node ./node_modules/jest/bin/jest.js --runInBand` passed (11 suites, 17 tests).
- `frontend`: `npm.cmd run build` passed. Vite emitted a chunk-size warning for the main JavaScript bundle (about 696 kB minified).
- `frontend`: `npm.cmd run lint` passed with existing hook-dependency, unused-catch, and fast-refresh warnings.
- `git diff --check` passed after the final source edits.

## Mandi API follow-up (2026-10-31)

### Audit categories

| Category | Findings |
|---|---|
| Fully implemented in source | Existing Integration Framework (`BaseHttpClient`, retry, cache), Collector Framework, raw market Data Lake writes, Mongo market pipeline (`market_prices_v2`, `market_arrivals`, `market_trends`, `market_raw`), OpenWeather adapter, and NestJS Gemini backend integration. |
| Partially implemented | Mandi adapter exists but is not live-verified. Weather current/forecast APIs exist, but its collector's `store()` is logging-only and there is no daily-history provider. Scheduler is a job registry without active Cron execution. Local Data Lake supports JSON/CSV/XML but not Parquet. `ai-service/` contains empty scaffold files: the FastAPI service itself is not implemented. |
| Missing | Live provider connection verification, market activation/subscription controls, executing distributed scheduler, persisted weather collection/history, Parquet export, FastAPI AI service/health contract, model registry, operational RAG ingestion/retrieval, and provider-level production health/observability. |
| Requires optimization | Market duplicate key previously omitted location/variety; missing arrival quantities flowed into normalization as zero; provider selection and collection schedule/configuration need deployment-level setup; existing health and data-quality checks need live-provider validation. |

### Mandi API findings and integration

- The upstream README describes a Node/Express REST API, Supabase `mandi_prices` storage, daily GitHub Actions ingestion from data.gov.in, five supported states including Karnataka, and a per-IP limit of 100 requests per 15 minutes. It documents `/v1/states`, `/v1/commodities`, `/v1/markets`, `/v1/prices`, and `/v1/prices/history`, with market/district/variety and min/max/modal prices in price records.
- The source repository declares CC BY-NC-SA 4.0. AgriSense consumes the hosted API and does not copy the upstream source code. If upstream code is copied or modified later, its attribution, non-commercial, and share-alike terms apply.
- API smoke requests to `/v1/states`, `/v1/markets?state=Karnataka`, and `/v1/prices?state=Karnataka` could not connect from the current execution environment (network egress is routed to a refused local proxy). The web reader also could not open the Render API. Therefore endpoint uptime, live response values, Karnataka market list, district coverage, freshness, pagination, and rate-limit enforcement remain **unverified**; no market-level coverage claim is made from a live response.
- Added `MandiApiDataSource` behind the existing `MarketCollector`. Choose it with `MARKET_DATA_SOURCE=mandi-api`; configure `MANDI_API_BASE_URL` only when needed. It maps the documented response shape, retains the original row in raw provenance, preserves `fetched_at`, uses the existing HTTP retry and in-memory cache facilities, and does not fall back to mock data. Date-specific requests use the documented history route when state and commodity are available.
- Price-only records do not contain a documented arrival quantity. Arrival values are now optional and the normalization pipeline emits an arrival record only when the provider supplies one; Mandi API records therefore do not fabricate zero arrivals.
- Mongo collection names remain unchanged. The repository's actual arrival and trend collections are `market_arrivals` and `market_trends` (not `_v2`); the prompt's collection-name list does not match the checked-in schemas. The market in-batch deduplication key now includes state, district, market, commodity, variety, grade, and arrival date.
- Normalized price and arrival writes now use source-aware Mongo upserts; partial unique indexes protect Mandi API records across repeated collections while retaining the existing collection names. Price variety and grade are carried into `market_prices_v2`.

### Remaining validation before production collection

- Enable `MARKET_DATA_SOURCE=mandi-api` only after a live smoke test from the deployment network confirms the response envelope and Karnataka market records.
- The ten-minute adapter cache is process-local and does not coordinate across replicas; a shared cache/distributed lock is still required for multi-instance scheduled collection.
- Existing scheduler code is not an executing Cron scheduler. Do not claim automatic market ingestion is active until a real scheduler and job are configured.
- The FastAPI directory and requirements/service files are zero bytes. No ChromaDB, LangChain, Hugging Face, Parquet, or model-registry implementation was added; there are no supplied documents/models or deployment constraints to validate those dependencies against.
- Latest verification for this update: Nest build passed; 13 Jest suites / 24 tests passed, including new adapter mapping and missing-arrival tests. Live HTTP endpoint checks could not run because the configured network proxy refused connections.

## Not verified / deployment blockers

PostgreSQL, MongoDB, live weather, production market-data source, Gemini, WhatsApp, SMS/DLT, and Redis/runtime worker availability were not verified. Do not represent market observations, AI analysis, queued notifications, or report generation as production-ready until the relevant services, migrations, and integration checks are run. No external farmer contact was attempted.
