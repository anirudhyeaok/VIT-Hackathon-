import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RecommendationsService {
  constructor(private prisma: PrismaService) {}

  async getActiveRecommendations(userId: string) {
    return this.prisma.recommendation.findMany({ where: { userId, isActive: true }, orderBy: { priority: 'desc' } });
  }

  async generateRecommendations(userId: string) {
    await this.prisma.recommendation.deleteMany({ where: { userId } });

    const rec1 = await this.prisma.recommendation.create({ data: { userId, type: 'savings', action: 'save', amount: 500, riskLevel: 'safe', title: 'Save ₹500 this week', reason: 'Your income increased by 18% this week.', priority: 10, isActive: true } });
    const rec2 = await this.prisma.recommendation.create({ data: { userId, type: 'credit', action: 'reduce_spending', title: 'Prioritize savings over loan repayment', reason: 'Emergency buffer below target.', priority: 8, isActive: true } });

    return [rec1, rec2];
  }
}
