import { Injectable } from '@nestjs/common';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

export type SymbolName = 'MES' | 'NQ';
export type Timeframe = '1m' | '5m' | '15m' | '1h';

export interface Candle {
  symbol: SymbolName;
  ts: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface AggregatedCandle {
  t: string;
  o: number;
  h: number;
  l: number;
  c: number;
  v: number;
}

const TIMEFRAME_MINUTES: Record<Timeframe, number> = {
  '1m': 1,
  '5m': 5,
  '15m': 15,
  '1h': 60,
};

const DATASET_PATH = resolve(
  process.cwd(),
  '..',
  'dataset',
  'candles_1m.json',
);

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function loadCandles(): Candle[] {
  const contents = readFileSync(DATASET_PATH, 'utf8');
  const parsed: unknown = JSON.parse(contents);

  if (!Array.isArray(parsed)) {
    throw new Error(`Candle dataset must be a JSON array: ${DATASET_PATH}`);
  }

  return parsed.map((value: unknown, index: number): Candle => {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
      throw new Error(`Invalid candle at dataset row ${index + 1}`);
    }

    const row = value as Record<string, unknown>;
    const { symbol, ts, open, high, low, close, volume } = row;

    if (symbol !== 'MES' && symbol !== 'NQ') {
      throw new Error(`Invalid symbol at dataset row ${index + 1}`);
    }
    if (typeof ts !== 'string' || !Number.isFinite(Date.parse(ts))) {
      throw new Error(`Invalid timestamp at dataset row ${index + 1}`);
    }
    if (
      !isFiniteNumber(open) ||
      !isFiniteNumber(high) ||
      !isFiniteNumber(low) ||
      !isFiniteNumber(close) ||
      !isFiniteNumber(volume) ||
      low > high ||
      low > open ||
      low > close ||
      high < open ||
      high < close ||
      volume < 0
    ) {
      throw new Error(`Invalid OHLCV values at dataset row ${index + 1}`);
    }

    return { symbol, ts, open, high, low, close, volume };
  });
}

export function aggregateCandles(
  candles: Candle[],
  timeframe: Timeframe,
): AggregatedCandle[] {
  const intervalMs = TIMEFRAME_MINUTES[timeframe] * 60_000;
  const uniqueCandles = new Map<string, Candle>();

  for (const candle of candles) {
    const key = `${candle.symbol}:${candle.ts}`;
    if (!uniqueCandles.has(key)) uniqueCandles.set(key, candle);
  }

  const groups = new Map<
    number,
    {
      firstTime: number;
      lastTime: number;
      open: number;
      high: number;
      low: number;
      close: number;
      volume: number;
    }
  >();

  for (const candle of uniqueCandles.values()) {
    const timestamp = Date.parse(candle.ts);
    const bucket = Math.floor(timestamp / intervalMs) * intervalMs;
    const current = groups.get(bucket);

    if (!current) {
      groups.set(bucket, {
        firstTime: timestamp,
        lastTime: timestamp,
        open: candle.open,
        high: candle.high,
        low: candle.low,
        close: candle.close,
        volume: candle.volume,
      });
      continue;
    }

    if (timestamp < current.firstTime) {
      current.firstTime = timestamp;
      current.open = candle.open;
    }
    if (timestamp > current.lastTime) {
      current.lastTime = timestamp;
      current.close = candle.close;
    }
    current.high = Math.max(current.high, candle.high);
    current.low = Math.min(current.low, candle.low);
    current.volume += candle.volume;
  }

  return [...groups.entries()]
    .sort(([firstBucket], [secondBucket]) => firstBucket - secondBucket)
    .map(([bucket, values]) => ({
      t: new Date(bucket).toISOString().replace('.000Z', 'Z'),
      o: values.open,
      h: values.high,
      l: values.low,
      c: values.close,
      v: values.volume,
    }));
}

@Injectable()
export class CandlesService {
  private readonly candles = loadCandles();

  getCandles(symbol: SymbolName, timeframe: Timeframe) {
    const candles = this.candles.filter((candle) => candle.symbol === symbol);

    return {
      symbol,
      tf: timeframe,
      candles: aggregateCandles(candles, timeframe),
    };
  }
}
