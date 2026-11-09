# ArrowFin Candle Explorer

React + TypeScript frontend for the candle-data assessment. It lets an evaluator choose a contract and timeframe, then plots the close prices returned by the NestJS API. The provided dataset is synthetic.

## Run locally

Start the backend from `backend/` with `npm run start:dev`, then start this app from `frontend/` with `npm run dev`. Vite forwards `/candles` requests to `http://localhost:3000`.

The interface supports `MES` and `NQ` with `1m`, `5m`, `15m`, and `1h` intervals.
