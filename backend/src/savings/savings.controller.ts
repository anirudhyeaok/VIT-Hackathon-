import { Controller, Get, UseGuards } from '@nestjs/common';
import { SavingsService } from './savings.service';
import { JwtAuthGuard } from '../auth/auth.guard';
import { User } from '../auth/user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('savings')
export class SavingsController {
  constructor(private readonly savingsService: SavingsService) {}

  @Get('recommend')
  getRecommendation(@User() user: any) {
    return this.savingsService.calculateSafeToSave(user.id);
  }
}
