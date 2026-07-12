# TransitOps

A smart transport operations and fleet management platform built for the Odoo Hackathon. 

The goal here was to build something production-ready, not just a standard hackathon prototype. We implemented proper role-based access control (RBAC), strict state machines for trips and vehicle statuses, and a solid financial analytics dashboard. 

## Core Stack
- **Frontend**: React, React Router v6, Tailwind CSS, Recharts
- **Backend**: Node.js, Express, MongoDB/Mongoose
- **Security**: JWT Auth, Helmet, rate-limiting, and NoSQL injection prevention

## How it works
The system revolves around four main roles: Fleet Manager, Dispatcher, Safety Officer, and Financial Analyst. Depending on who is logged in, you get access to different modules:

- **Vehicles & Drivers**: Track licenses, safety scores, and maintenance status. You can't dispatch a vehicle if it's "In Shop" or a driver if they're assigned to another trip.
- **Dispatching**: Strict workflow for trips. Draft -> Dispatched -> Completed/Cancelled. Assigning a vehicle/driver to a trip automatically locks them so they can't be double-booked.
- **Maintenance**: Logging an issue puts a vehicle "In Shop". Closing the ticket returns it to the available pool.
- **Analytics**: Calculates fuel efficiency, operational costs, and handles CSV exports for financial reporting.

## Setup & Running Locally

Make sure you have Node (v18+) and MongoDB installed.

1. Clone the repo and install dependencies:
   ```bash
   cd server && npm install
   cd ../client && npm install
   ```

2. Create a `.env` in the `server` directory with your local config:
   ```env
   PORT=3046
   MONGO_URI=mongodb://127.0.0.1:27017/transitops
   JWT_SECRET=your_super_secret_jwt_key_here
   NODE_ENV=development
   ```

3. Spin everything up:
   - For the backend: `cd server && npm run dev`
   - For the frontend: `cd client && npm run dev`

Navigate to `http://localhost:5173` and you're good to go. 

## Notes for Judges
We spent a lot of time polishing the UX and ensuring the backend doesn't break under weird edge cases. Try creating a trip, locking a vehicle in maintenance, and checking how the UI responds when you try to dispatch that same vehicle. You can also export the financial analytics to CSV directly from the dashboard.
