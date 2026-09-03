import { Controller, Get, UseGuards } from '@nestjs/common';
import { ForecastService } from './forecast.service';
import { JwtAuthGuard } from '../auth/auth.guard';
import { User } from '../auth/user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('forecast')
export class ForecastController {
  constructor(private readonly forecastService: ForecastService) {}

  @Get()
  getForecast(@User() user: any) {
    return this.forecastService.getForecast(user.id);
  }
}
