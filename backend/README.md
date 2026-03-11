# Event Booking Platform - Backend

Backend for an event ticket booking platform built with Node.js, Express, MongoDB, and BullMQ.

Setup:

1. Copy `.env.example` to `.env` and fill values.
2. Install dependencies: `npm install`.
3. Start with: `npm run dev` (requires nodemon) or `npm start`.

Notes:
- Requires MongoDB Atlas connection string in `MONGO_URI`.
- Requires Redis for BullMQ at `REDIS_URL`.
