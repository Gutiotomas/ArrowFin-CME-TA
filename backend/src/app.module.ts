import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { CandlesService } from './candles/candles.service.js';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [CandlesService],
})
export class AppModule {}
