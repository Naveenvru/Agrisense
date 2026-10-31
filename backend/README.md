# 🌾 AgriSense Backend

The robust, highly scalable API serving as the backbone for the AgriSense platform. Built with NestJS, this backend integrates complex agricultural business logic, multi-database persistence, and external data services.

## 🛠️ Technology Stack

- **Framework**: NestJS (Node.js), TypeScript
- **Relational Database**: PostgreSQL (via TypeORM)
- **NoSQL Database**: MongoDB (via Mongoose)
- **Authentication**: Passport.js, JWT, Google OAuth20
- **Validation**: Class Validator & Class Transformer
- **Documentation**: Swagger UI (`@nestjs/swagger`)

## 🧠 Core Intelligence Modules

The backend is modularized by feature, with a heavy emphasis on "Intelligence" services:

- **Harvest Intelligence**: Determines optimal harvesting windows based on crop maturity and weather conditions.
- **Yield Intelligence**: Predicts crop yields using historical data and current metrics.
- **Supply & Demand Intelligence**: Analyzes market demand and supply chains to provide pricing and distribution recommendations.
- **GeoBoundary**: Manages and caches complex geospatial data (GeoJSON) for land parcels using MongoDB.
- **Weather & Market**: Integrates with external APIs (e.g., OpenWeather) to fetch real-time agricultural conditions.

## 🚀 Getting Started

### 1. Prerequisites
- **PostgreSQL** instance running.
- **MongoDB** instance running.
- Node.js (v18+)

### 2. Environment Configuration
Create a `.env` file in the root of the backend directory (use `.env.example` as a template):
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=agrisense_db
DB_USER=postgres
DB_PASSWORD=your_secure_password

MONGODB_URI=mongodb://localhost:27017/agrisense_mongo
MONGODB_DATABASE=agrisense_mongo

JWT_SECRET=your_jwt_secret
OPENWEATHER_API_KEY=your_api_key
```

### 3. Installation
```bash
npm install
```

### 4. Running the Server
```bash
# development
npm run start

# watch mode (recommended for development)
npm run start:dev

# production mode
npm run start:prod
```

### 5. API Documentation
Once the server is running, the Swagger API documentation is typically available at:
`http://localhost:5000/api` (or whichever port is defined).

## 🧪 Testing

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e
```

## Market price provider

Market collection uses the existing `MarketCollector` → data lake → quality/normalization → MongoDB pipeline. To select the external Mandi Price API, configure the backend environment:

```env
MARKET_DATA_SOURCE=mandi-api
MANDI_API_BASE_URL=https://mandi-api.onrender.com/v1
```

The adapter uses `/prices` for latest records and `/prices/history` when state, commodity, and a date are supplied. It stores provider records in the existing `market_raw` and `market_prices_v2` collections. `fetched_at` is retained as provider retrieval metadata, while `collectedAt` records AgriSense's own collection time. The API's documented price response does not include arrival quantity, so no arrival observation is created from a price-only record.

Successful responses are cached in process for ten minutes to reduce calls. The API repository documents a limit of 100 requests per 15 minutes per IP; this limit and the live response behavior have not been independently verified from this environment. API failures are surfaced as collection failures and never replaced with synthetic records. To use synthetic fixtures locally, explicitly set `MARKET_DATA_SOURCE=mock`; leave the variable unset to disable collection.

`MANDI_API_BASE_URL` is optional and should only be changed to a compatible API deployment. The adapter follows the documented `{ success, data, meta }` response envelope and price field names. A live smoke check is still required before enabling scheduled ingestion in a deployment.

## OpenAI chatbot and Commodities MCP

The existing farmer chat drawer now uses the authenticated `POST /ai/chat` gateway, which calls OpenAI's Responses API from the backend. Configure these server-only variables:

```env
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4.1-mini
COMMODITIES_MCP_URL=https://commodities-api.mcp.commodities-api.com/mcp
COMMODITIES_MCP_TOKEN=
```

The gateway discovers MCP tools and schemas for each price-oriented request, then exposes them to the model as function tools. Credentials are never sent to React or included in model tool arguments. The connected Commodities MCP currently publishes global commodity/currency tools; its catalog does not include mandi/APMC, district, state, or arrival records. Mandi-specific requests therefore return a clear unavailable-data answer instead of substituting global quotes. Historical mandi data remains available through the existing `/market/prices` API when collected records exist.

The MCP server completed an authenticated protocol handshake during integration, but its `commodities.symbols` live call rejected the configured bearer credential as invalid/expired and indicated a paid plan is required. Successful live price retrieval must be rechecked after a valid provider subscription token is configured. OpenAI requests could not be live-verified without an `OPENAI_API_KEY`.
