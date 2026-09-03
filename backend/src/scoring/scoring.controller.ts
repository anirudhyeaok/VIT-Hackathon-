import { Controller, Get, UseGuards } from '@nestjs/common';
import { ScoringService } from './scoring.service';
import { JwtAuthGuard } from '../auth/auth.guard';
import { User } from '../auth/user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('scoring')
export class ScoringController {
  constructor(private readonly scoringService: ScoringService) {}

  @Get('resilience')
  getResilienceScore(@User() user: any) {
    return this.scoringService.calculateResilienceScore(user.id);
  }

  @Get('consistency')
  getConsistencyScore(@User() user: any) {
    return this.scoringService.calculateConsistencyScore(user.id);
  }
}
