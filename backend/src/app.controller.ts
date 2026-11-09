import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { CandlesService } from './candles/candles.service.js';

@Controller('candles')
export class AppController {
  constructor(private readonly candlesService: CandlesService) {}

  @Get()
  getCandles(
    @Query('symbol') symbol: unknown,
    @Query('tf') timeframe: unknown,
  ) {
    if (symbol !== 'MES' && symbol !== 'NQ') {
      throw new BadRequestException('symbol must be MES or NQ');
    }

    if (
      timeframe !== '1m' &&
      timeframe !== '5m' &&
      timeframe !== '15m' &&
      timeframe !== '1h'
    ) {
      throw new BadRequestException('tf must be one of: 1m, 5m, 15m, 1h');
    }

    return this.candlesService.getCandles(symbol, timeframe);
  }
}
