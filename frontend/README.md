# 🌾 AgriSense Frontend

The frontend application for the AgriSense platform. This is a highly interactive, data-rich dashboard designed to give farmers and agricultural managers complete control and visibility over their operations.

## 🛠️ Technology Stack

- **Core Framework**: React 19, TypeScript, Vite
- **Routing**: React Router DOM (v7)
- **State Management & Data Fetching**: TanStack React Query, Context API, Axios
- **Styling & UI**: Tailwind CSS, Radix UI, Class Variance Authority (CVA)
- **Animations**: Framer Motion for fluid micro-interactions and page transitions
- **Mapping**: Leaflet & React Leaflet for geospatial land parcel visualization
- **Forms & Validation**: React Hook Form with Zod schema validation
- **Data Visualization**: Recharts for market trends and yield analytics

## 🌟 Core Features & Modules

- **Authentication (`/auth`)**: Secure login and signup with OAuth support.
- **Dashboard (`/dashboard`)**: A high-level overview of active crops, recent weather alerts, and market summaries.
- **Farm Management (`/farm`)**: Detailed tracking of land parcels, crop history, and current plantings.
- **Decision Intelligence (`/ai`)**: Interactive pipelines for evaluating harvest risks, yield predictions, and simulated scenarios.
- **Market & Weather (`/market`, `/weather`)**: Real-time integrations displaying commodity prices and meteorological data.
- **Disease Detection (`/disease`)**: Interface for uploading crop imagery and receiving AI-driven diagnosis.

## 🚀 Getting Started

### 1. Installation
Install the required Node dependencies:
```bash
npm install
```

### 2. Development Server
Start the Vite development server with Hot Module Replacement (HMR):
```bash
npm run dev
```
The application will typically be available at `http://localhost:5173`.

### 3. Build & Preview
To build the application for production:
```bash
npm run build
```
To preview the production build locally:
```bash
npm run preview
```

## 🎨 UI/UX Philosophy

The AgriSense frontend is built with a focus on **Premium Aesthetics**. It leverages a cohesive design system using Tailwind CSS, featuring glassmorphism elements, dynamic hover states, and smooth Framer Motion animations to make the dashboard feel responsive, alive, and incredibly modern.
