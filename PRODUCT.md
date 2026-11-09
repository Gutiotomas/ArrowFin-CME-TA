# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Full-stack assessment evaluators reviewing and exercising the application.

## Product Purpose

Let an evaluator select a futures contract and timeframe, then inspect the backend's candle response in a chart. Success means the selectors call the endpoint correctly, the response is visualized, and loading and error states are understandable.

## Operating Context

The interface is the frontend portion of a time-boxed technical assessment. It works with the provided one-session dataset for MES and NQ and the NestJS candles endpoint.

## Capabilities and Constraints

- Provide a symbol selector and timeframe selector.
- Display the returned candles as a chart; a close-price line is acceptable.
- Show a useful loading state and an understandable error state.
- Keep the implementation focused on the assessment; no extra product features were requested.
- The frontend uses the existing React, TypeScript, and Vite scaffold.

## Evidence on Hand

- The fabricated assessment dataset is in `dataset/`.
- The backend endpoint is implemented in `backend/src/app.controller.ts` and `backend/src/candles/candles.service.ts`.
- No customer, production, or market-performance claims are established.

## Product Principles

- Make it easy to exercise the actual backend behavior.
- Keep the selected instrument, timeframe, and chart data clear.
- Explain loading and failure rather than hiding them.
- Do not imply the fabricated dataset represents live market data.
