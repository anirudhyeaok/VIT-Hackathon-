import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ScoringService {
  constructor(private prisma: PrismaService) {}

  async calculateResilienceScore(userId: string) {
    const consistencyData = await this.calculateConsistencyScore(userId);

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    const targetBuffer = user?.emergencyBuffer || 5000;
    
    const currentBuffer = targetBuffer * 0.8;
    const emergencyBufferScore = Math.min((currentBuffer / targetBuffer) * 30, 30);
    
    const incomeStabilityScore = 15;
    const expenseStabilityScore = 12;
    const debtBurdenScore = 18;
    const savingsBehaviourScore = 10;

    const baseScore = emergencyBufferScore + incomeStabilityScore + expenseStabilityScore + debtBurdenScore + savingsBehaviourScore;
    const overallScore = Math.min(baseScore + consistencyData.score, 100);

    const explanation = `Your resilience score is ${overallScore.toFixed(0)} out of 100. ${consistencyData.explanation}`;

    const record = await this.prisma.resilienceScore.create({
      data: {
        userId,
        overallScore,
        emergencyBufferScore,
        incomeStabilityScore,
        expenseStabilityScore,
        debtBurdenScore,
        savingsBehaviourScore,
        platformConsistency: consistencyData.score,
        explanation
      }
    });

    return {
      record,
      crossPlatformConsistency: consistencyData
    };
  }

  async calculateConsistencyScore(userId: string) {
    const connections = await this.prisma.platformConnection.findMany({
      where: { userId }
    });
    
    const platformsLinked = connections.length;
    const platformsActive = connections.filter(c => c.status === 'linked').length;
    
    const combinedWorkDays = platformsLinked > 1 ? 22 : 15;
    
    let consistencyRating = 'poor';
    let score = 0;
    
    if (combinedWorkDays > 20 && platformsActive > 1) {
      consistencyRating = 'excellent';
      score = 15; // Major scoring factor now
    } else if (combinedWorkDays > 15) {
      consistencyRating = 'good';
      score = 10;
    } else if (combinedWorkDays > 10) {
      consistencyRating = 'fair';
      score = 5;
    }

    return {
      score,
      platformsLinked,
      platformsActive,
      combinedWorkDays,
      consistencyRating,
      explanation: `Working across ${platformsActive} active platforms gives you ${combinedWorkDays} unique earning days, leading to a ${consistencyRating} rating.`
    };
  }
}
