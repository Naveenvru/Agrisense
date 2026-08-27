# AgriSense Backend

The backend API for the AgriSense platform, built with NestJS.

## Technology Stack

- **Core**: NestJS (Node.js framework), TypeScript
- **Databases**: 
  - PostgreSQL (relational data) via TypeORM
  - MongoDB (document data) via Mongoose
- **Authentication**: Passport, JWT, Google OAuth20
- **Documentation**: Swagger UI

## Setup & Running Locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables (create a `.env` file based on your local setup).

3. Start the development server:
   ```bash
   npm run start:dev
   ```

## Scripts

- `npm run build`: Compiles the application.
- `npm run start:dev`: Starts the server in watch mode.
- `npm run test`: Runs unit tests using Jest.
- `npm run lint`: Lints the codebase.
