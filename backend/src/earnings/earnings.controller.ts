import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { EarningsService } from './earnings.service';
import { JwtAuthGuard } from '../auth/auth.guard';
import { User } from '../auth/user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('earnings')
export class EarningsController {
  constructor(private readonly earningsService: EarningsService) {}

  @Get('history')
  getHistory(@User() user: any, @Query('days') days: number, @Query('platform') platform: string) {
    return this.earningsService.getHistory(user.id, days || 28, platform || 'all');
  }

  @Get('summary')
  getSummary(@User() user: any) {
    return this.earningsService.getSummary(user.id);
  }

  @Get('by-platform')
  getByPlatform(@User() user: any) {
    return this.earningsService.getByPlatform(user.id);
  }
}
