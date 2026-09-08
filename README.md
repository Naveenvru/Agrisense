#  AgriSense: Intelligent Agricultural Management Platform

AgriSense is a comprehensive, AI-powered agricultural intelligence and farm management platform. It bridges the gap between traditional farming and modern data science by providing farmers and agricultural enterprises with actionable insights into crop yield, market demand, harvest intelligence, and weather forecasting.

##  Key Features

- **Decision Intelligence**: AI-driven pipelines for yield prediction, harvest planning, and supply/demand forecasting.
- **Farm & Land Management**: Manage land parcels, track crop growth cycles, and monitor geoboundaries.
- **Market Intelligence**: Real-time market data integration to optimize selling strategies.
- **Disease Detection**: Integrated AI service to detect crop diseases and recommend treatments.
- **Interactive Dashboards**: Rich, responsive, and animated UI providing a bird's-eye view of all agricultural operations.

---

##  System Architecture

AgriSense employs a robust, highly scalable microservices-oriented architecture:

### 1. Frontend (Client Dashboard)
A modern, responsive web application built with **React 19**, **TypeScript**, and **Vite**. It utilizes **Tailwind CSS** and **Framer Motion** for a premium aesthetic, and relies on **React Query** for efficient data synchronization.

### 2. Core Backend (API Gateway & Business Logic)
A powerful **NestJS** backend built with **TypeScript**. It utilizes a polyglot persistence strategy:
- **PostgreSQL (TypeORM)**: For relational data such as user profiles, auth, and relational master data.
- **MongoDB (Mongoose)**: For unstructured/semi-structured data like geospatial boundaries, cached demand analytics, and intelligence logs.

### 3. AI Service (Machine Learning Microservice)
A dedicated **Python** microservice handling heavy computational tasks like image-based disease detection, advanced forecasting, and machine learning inferences.

---

## Getting Started

### Prerequisites
Before you begin, ensure you have the following installed on your machine:
- **Node.js** (v18 or higher)
- **Python** (v3.10+ for the AI Service)
- **PostgreSQL** (running locally or via Docker)
- **MongoDB** (running locally or via Docker)

### 1. Starting the Backend
Navigate to the backend directory, configure your environment variables, and start the NestJS server.
```bash
cd backend
npm install
cp .env.example .env # Ensure you update the .env with your DB credentials
npm run start:dev
```

### 2. Starting the Frontend
Navigate to the frontend directory and start the Vite development server.
```bash
cd frontend
npm install
npm run dev
```

### 3. Starting the AI Service
Navigate to the `ai-service` directory, create a virtual environment, and run the Python service.
```bash
cd ai-service
python -m venv venv
source venv/bin/activate  # Or `venv\Scripts\activate` on Windows
pip install -r requirements.txt
# (Command to run the service depends on the framework used, e.g., uvicorn main:app --reload)
```

---

##  Repository Structure

```text
Agrisense2/
├── frontend/           # React dashboard application
├── backend/            # NestJS core API
├── ai-service/         # Python ML microservice
├── docs/               # Project documentation
└── datasets/           # ML datasets and sample data
```