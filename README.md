# ArrowFin CME Candle Explorer

## Setup and run

Requires Node.js and npm. From the project root, install dependencies and run the available tests and checks:

1. Install both projects' dependencies, then run backend tests and frontend checks:

   ```bash
   npm ci --prefix backend && npm ci --prefix frontend && (cd backend && npm test && npm run test:e2e) && (cd frontend && npm run build && npm run lint)
   ```

2. Start the backend (NestJS, `http://localhost:3000`) in a terminal:

   ```bash
   cd backend && npm run start:dev
   ```

3. Start the frontend (Vite, `http://localhost:5173`) in another terminal:

   ```bash
   cd frontend && npm run dev
   ```

The frontend does not currently have a separate automated test script. Vite proxies `/candles` requests to the backend. The synthetic dataset is in `dataset/`.
