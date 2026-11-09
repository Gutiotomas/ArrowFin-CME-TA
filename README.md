# ArrowFin CME Candle Explorer

## Run locally

Requires Node.js and npm. Start each server in a separate terminal from the project root:

1. Backend (NestJS, `http://localhost:3000`):

   ```bash
   cd backend && npm run start:dev
   ```

2. Frontend (Vite, `http://localhost:5173`):

   ```bash
   cd frontend && npm run dev
   ```

## Tests and checks

Run backend unit and end-to-end tests, then the frontend production build and lint:

```bash
cd backend && npm test && npm run test:e2e && cd ../frontend && npm run build && npm run lint
```

The frontend does not currently have a separate automated test script. Vite proxies `/candles` requests to the backend. The synthetic dataset is in `dataset/`.
