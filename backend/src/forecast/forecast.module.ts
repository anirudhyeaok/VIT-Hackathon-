import { Module } from '@nestjs/common';
import { ForecastController } from './forecast.controller';
import { ForecastService } from './forecast.service';

@Module({
  controllers: [ForecastController],
  providers: [ForecastService],
})
export class ForecastModule {}
