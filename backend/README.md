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
