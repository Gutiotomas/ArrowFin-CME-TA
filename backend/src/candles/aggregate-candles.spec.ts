import { aggregateCandles, type Candle } from './candles.service.js';

describe('aggregateCandles', () => {
  it('aggregates open, high, low, close, and volume for a timeframe', () => {
    const candles: Candle[] = [
      {
        symbol: 'MES',
        ts: '2026-08-25T14:07:00Z',
        open: 100.5,
        high: 102,
        low: 100,
        close: 101,
        volume: 10,
      },
      {
        symbol: 'MES',
        ts: '2026-08-25T14:05:00Z',
        open: 100,
        high: 101,
        low: 99.5,
        close: 100.5,
        volume: 20,
      },
      {
        symbol: 'MES',
        ts: '2026-08-25T14:09:00Z',
        open: 101,
        high: 101.5,
        low: 98,
        close: 99,
        volume: 30,
      },
    ];

    expect(aggregateCandles(candles, '5m')).toEqual([
      { t: '2026-08-25T14:05:00Z', o: 100, h: 102, l: 98, c: 99, v: 60 },
    ]);
  });
});
