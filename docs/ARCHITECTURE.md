# AgriSense Architecture Snapshot

This document records the current application boundaries before the temporary Gemini API connection is verified.

## Application layers

- **Frontend:** React + TypeScript + Vite. Feature pages call the backend through the shared Axios client. Provider secrets do not belong in frontend environment variables or browser bundles.
- **Backend:** NestJS modules expose authenticated REST APIs. Configuration is loaded by `ConfigModule`; database access uses TypeORM/PostgreSQL, with the existing MongoDB module retained for its current responsibilities.
- **Persistence:** PostgreSQL entities and migrations own user, farm, crop, notification, decision-trace, report, and settings records. User AI preferences are persisted through the Settings module.
- **Scheduling and notifications:** Notification jobs and delivery attempts are persisted and processed through the Notifications module and scheduler.

## Gemini integration path

1. The AI chat, explanation, and disease-analysis screens call `frontend/src/features/ai/services/gemini.service.ts`.
2. The shared Axios client sends authenticated requests to `POST /gemini/chat`, `/gemini/explain`, or `/gemini/analyze-disease`.
3. `GeminiController` requires a valid JWT and checks the signed-in user's persisted `aiAssistanceEnabled` preference before provider access.
4. User farm/profile context is added only when that user's `personalizedRecommendationsEnabled` preference is enabled.
5. `GeminiService` reads `GEMINI_API_KEY` on the backend and calls Google through `@google/genai`. Model IDs are configurable with `GEMINI_MODEL` and `GEMINI_FALLBACK_MODEL`.

The API key remains in the ignored local `backend/.env`. It is never returned to the frontend. AI use remains per-account opt-in; configuring the application key does not enable AI for every farmer.

## Current local Gemini defaults

- Primary model: `gemini-3.6-flash`
- Fallback model: `gemini-3.8-flash`

Both model IDs can be overridden in the backend environment without changing module boundaries. The previous fallback, `gemini-2.0-flash`, was already shut down according to Google's current [Gemini API deprecation schedule](https://ai.google.dev/gemini-api/docs/deprecations).

## Connection check (2026-10-30)

- The local backend key successfully retrieved metadata for both configured model IDs.
- A minimal text-generation request reached Google but returned HTTP 503 for both tested generation attempts. The credential and model IDs are recognized; live generation remains subject to Google's temporary service availability.
- The local backend key is stored only in ignored `backend/.env`; the frontend environment has no Gemini key.

## GIS and vegetation monitoring

- Existing parcel point storage remains `farmer_land_parcels.location GEOGRAPHY(POINT,4326)` for weather and prior consumers. Migration `12_gis_farm_parcels.sql` adds a separate `boundary_geom geometry(Polygon,4326)`, centroid geography, PostGIS-calculated area units, a structured `land_profile`, location quality, constraints, and GiST indexes.
- Parcel geometry is validated with PostGIS `ST_IsValid`; area is calculated with `ST_Area(geom::geography)`. Farmer-entered total area remains in `area_acres`; calculated values are stored separately. Parcel APIs remain JWT protected and ownership scoped. Nearby, containing, overlap, and area-preview operations use PostGIS.
- The React Leaflet map supports user-triggered location search, browser GPS, OSM street tiles, Esri satellite/topographic tiles, polygon drawing, vertex movement/addition/removal, confirmation and preview. Search uses public Nominatim only on explicit submission, is throttled client-side, and does not autocomplete.
- Public tile services are development defaults. The OpenStreetMap standard tile server has no production SLA and imposes attribution, cache, and use restrictions; do not preload or bulk download tiles. A production launch should select a contracted tile service and configure both its `VITE_*_TILE_URL` and `VITE_*_TILE_ATTRIBUTION`. Esri imagery services require their current attribution and an applicable license for commercial usage. Search can be moved to a contracted geocoder using `VITE_GEOCODING_URL`.
- `vegetation` is an authenticated Nest module. Migration `13_satellite_vegetation.sql` persists idempotent processing jobs and real observations. A worker requests Sentinel-2 L2A statistics for the owned polygon through the CDSE Sentinel Hub Statistical API (`/statistics/v1`), using B04/B08 at 10 m and the output-specific data mask to exclude no-data, cloud, and shadow pixels from NDVI while measuring cloud/shadow share separately. API credentials stay backend-only (`SENTINEL_HUB_CLIENT_ID`, `SENTINEL_HUB_CLIENT_SECRET`; optional token/statistics URL overrides in `backend/.env`). Without credentials, no satellite observation is created. No NDVI is derived from visible basemap tiles.
- Sentinel-2 revisit is nominally about five days for the constellation, but cloud cover, scene availability, latitude and provider catalogue delay mean usable parcel observations are less regular. The Statistical API avoids downloading full scenes. Sentinel Hub/CDSE account access, API quotas, terms, and any applicable subscription limits must be confirmed for the deployment.
- Cloud/shadow share is checked against the farmer-selected threshold before an observation is stored. Missing pixels create a `no_data` job; excessive cloud/shadow creates `quality_insufficient`; neither becomes a vegetation-deterioration event. NDVI interpretation in the UI is descriptive and is not a disease diagnosis.
- Current provider integration returns parcel-level statistics and history only. A per-pixel NDVI raster/map overlay, automated recurring acquisition schedule, market-distance ranking, and AI/notification use of NDVI are not connected yet. Raster output/object storage and provider plan quotas need selection before those features are production-ready.

## GIS provider references

- [OpenStreetMap tile usage policy](https://operations.osmfoundation.org/policies/tiles/)
- [Nominatim usage policy](https://operations.osmfoundation.org/policies/nominatim/)
- [Esri World Imagery attribution guidance](https://support.esri.com/en-us/knowledge-base/what-is-the-correct-way-to-cite-an-arcgis-online-basema-000012040) and [Esri service terms](https://www.esri.com/en-us/legal/terms/web-site-service)
- [Sentinel Hub Statistical API](https://documentation.dataspace.copernicus.eu/APIs/SentinelHub/Statistical.html) and [CDSE OAuth client credentials](https://documentation.dataspace.copernicus.eu/APIs/SentinelHub/Overview/Authentication.html)
- [Sentinel-2 L2A band reference](https://documentation.dataspace.copernicus.eu/APIs/SentinelHub/Data/S2L2A.html)
