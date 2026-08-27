# AgriSense

An Agricultural Intelligence and Management Platform.

AgriSense provides decision intelligence and agricultural data management through a comprehensive full-stack architecture.

## Architecture

- **Frontend**: A modern React application built with Vite, TypeScript, and TailwindCSS. It utilizes React Query for data fetching, React Leaflet for geospatial features, and Framer Motion for dynamic animations.
- **Backend**: A robust NestJS API built with TypeScript, leveraging both PostgreSQL (via TypeORM) and MongoDB (via Mongoose) to handle complex agricultural datasets, AI recommendations, and demand analytics.

## Getting Started

### Prerequisites
- Node.js
- PostgreSQL and MongoDB instances

### Running the Application

**Backend**
```bash
cd backend
npm install
npm run start:dev
```

**Frontend**
```bash
cd frontend
npm install
npm run dev
```