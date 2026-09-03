import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ScoringService } from '../scoring/scoring.service';
import { PlatformsService } from '../platforms/platforms.service';
import { RecommendationsService } from '../recommendations/recommendations.service';
import { EarningsService } from '../earnings/earnings.service';

@Injectable()
export class DashboardService {
  constructor(
    private prisma: PrismaService,
    private scoringService: ScoringService,
    private platformsService: PlatformsService,
    private recService: RecommendationsService,
    private earningsService: EarningsService
  ) {}

  async getDashboardData(userId: string) {
    const score = await this.scoringService.calculateResilienceScore(userId);
    const platformsHealth = await this.platformsService.getHealthStatus(userId);
    const recs = await this.recService.getActiveRecommendations(userId);
    const earnings = await this.earningsService.getSummary(userId);
    const activeLoans = await this.prisma.loan.findMany({ where: { userId, status: { not: 'repaid' } } });
    
    return {
      resilienceScore: score.record.overallScore,
      scoreBreakdown: {
        emergency: score.record.emergencyBufferScore,
        income: score.record.incomeStabilityScore,
        expense: score.record.expenseStabilityScore,
        debt: score.record.debtBurdenScore,
        savings: score.record.savingsBehaviourScore,
        platformConsistency: score.record.platformConsistency,
      },
      crossPlatformConsistency: score.crossPlatformConsistency,
      totalIncome: earnings.total,
      totalExpenses: 12000, // mock
      currentBalance: 8000, // mock
      activeLoans,
      safeToSave: 2000,
      topRecommendation: recs[0] || null,
      alerts: [],
      platformsHealth: platformsHealth.details,
      forecast: {
        currentBalance: 8000, expectedIncome: 25000, expectedExpenses: 12000, projectedBalance: 21000
      }
    };
  }
}
