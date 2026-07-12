# TransitOps - Smart Transport Operations Platform

TransitOps is a comprehensive fleet management and dispatching system built for the Odoo Hackathon. It streamlines the lifecycle of vehicles, drivers, trips, fuel logs, and maintenance into a unified, secure, and performant platform.

## Features

- **Vehicle & Driver Management:** Enforce unique licenses, registrations, and track safety scores and expirations.
- **Smart Dispatching:** Strict state-machine workflow (`Draft` -> `Dispatched` -> `Completed`/`Cancelled`) preventing double-dispatching and ensuring valid cargo weights.
- **Maintenance & Asset Locking:** Opening a maintenance ticket immediately locks a vehicle (`In Shop`), preventing dispatch until resolved.
- **Financial Analytics & Fuel Tracking:** Tracks fuel efficiency (km/L) and calculates total operational cost, automatically simulating ROI.
- **Export Capabilities:** One-click CSV exports of comprehensive financial data.

## Architecture & Security

This project was built to production standards:
- **Global Error Handling:** Consistent API error formatting with `AppError` and centralized middleware.
- **Security Middleware:** Includes `helmet` for HTTP headers, `express-rate-limit` for DDoS protection, and `express-mongo-sanitize` for NoSQL injection prevention.
- **Resilience:** React Error Boundaries prevent complete frontend crashes, and global Axios interceptors handle token expirations gracefully.
- **Input Validation:** Strict Mongoose schemas with built-in validation rules and index structures.

## Tech Stack

- **Frontend:** React, React Router, TailwindCSS, Axios, Recharts, React Toastify.
- **Backend:** Node.js, Express, MongoDB (Mongoose), JWT Auth.

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB connection string

### Environment Variables
Create `.env` in the `server` directory:
```
PORT=3046
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

### Installation
1. Navigate to the root directory.
2. Run `npm install` in both the root, `client`, and `server` folders (or rely on `npm i` if workspace configured).
3. Start the application:
   - Backend: `cd server && npm run server`
   - Frontend: `cd client && npm run dev`

## API Documentation

- `POST /api/auth/login`: Authenticate and receive JWT.
- `GET /api/vehicles`: Fetch registry.
- `PUT /api/trips/:id/dispatch`: Dispatch trip and lock assets.
- `GET /api/reports/financials/export`: Download CSV analytics.
