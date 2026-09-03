import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { ScoringModule } from '../scoring/scoring.module';
import { EarningsModule } from '../earnings/earnings.module';
import { PlatformsModule } from '../platforms/platforms.module';
import { RecommendationsModule } from '../recommendations/recommendations.module';

@Module({
  imports: [ScoringModule, EarningsModule, PlatformsModule, RecommendationsModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
