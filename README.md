# Real Estate Lead Management Dashboard

A fast, demo-ready lead management dashboard for sales teams to track, prioritize, and convert real estate leads.

## What It Does
- Add lead
- View leads
- Search leads
- Filter leads by status and source
- Update lead status
- Show dashboard metrics
- Surface lead priority scores
- Show follow-up alert badges

## Tech Stack
- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn-style UI components
- Recharts
- Node.js
- Express
- MongoDB
- Mongoose

## Product Feature
Lead Priority Scoring + Follow-Up Alert Engine

This feature ranks leads by source, budget, and pipeline stage, then highlights leads that need attention within 48 hours.

## Project Structure
```txt
client/
server/
```

## Setup
1. Copy `server/.env.example` to `server/.env`.
2. Copy `client/.env.example` to `client/.env` if you want to point to the API.
3. Start MongoDB locally.
4. Run the backend.
5. Run the frontend.

## Scripts
### Backend
```bash
npm run dev --workspace=server
npm run build --workspace=server
npm run seed --workspace=server
```

### Frontend
```bash
npm run dev --workspace=client
npm run build --workspace=client
```

## API
- `GET /api/leads`
- `POST /api/leads`
- `PATCH /api/leads/:id`
- `DELETE /api/leads/:id`
- `POST /api/leads/:id/recalculate`
- `POST /api/leads/recalculate-scores`
- `GET /api/metrics`

## Metrics
- Total Leads
- Leads by Status
- Leads by Source
- Conversion Rate

## Demo Notes
- Use seeded data to show a realistic pipeline.
- Point out the hot/warm scoring badges in the table.
- Demonstrate a status update from New Lead to Negotiation or Closed Won.
- Show how follow-up alerts highlight urgent opportunities.

## Deployment
- Backend can be deployed to Render or similar Node hosting.
- Frontend can be deployed to Vercel or any static hosting provider.
- Use environment variables for `MONGO_URI` and `VITE_API_URL`.

