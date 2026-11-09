import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types.js';
import { AppModule } from './../src/app.module.js';

describe('Candles endpoint (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('returns the five-minute candle with duplicate dataset rows counted once', async () => {
    const response = await request(app.getHttpServer())
      .get('/candles')
      .query({ symbol: 'MES', tf: '5m' })
      .expect(200);

    const candle = response.body.candles.find(
      (item: { t: string }) => item.t === '2026-08-25T14:10:00Z',
    );

    expect(response.body.symbol).toBe('MES');
    expect(response.body.tf).toBe('5m');
    const timestamps = response.body.candles.map(
      (item: { t: string }) => Date.parse(item.t),
    );
    expect(timestamps).toEqual([...timestamps].sort((a, b) => a - b));
    expect(candle).toEqual({
      t: '2026-08-25T14:10:00Z',
      o: 5627.25,
      h: 5632.75,
      l: 5624.75,
      c: 5628.5,
      v: 9896,
    });
  });

  it('rejects an unsupported symbol with a clear 400 response', async () => {
    await request(app.getHttpServer())
      .get('/candles')
      .query({ symbol: 'ES', tf: '5m' })
      .expect(400)
      .expect(({ body }) => {
        expect(body.message).toBe('symbol must be MES or NQ');
      });
  });

  it('rejects an unsupported timeframe with a clear 400 response', async () => {
    await request(app.getHttpServer())
      .get('/candles')
      .query({ symbol: 'MES', tf: '2m' })
      .expect(400)
      .expect(({ body }) => {
        expect(body.message).toBe('tf must be one of: 1m, 5m, 15m, 1h');
      });
  });
});
