import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CreditService {
  constructor(private prisma: PrismaService) {}

  async evaluateLoanRequest(userId: string, requestedAmount: number) {
    // 1. Calculate Monthly Income (Mock average daily income * 30 for hackathon)
    const avgDailyIncome = 850; 
    const monthlyIncome = avgDailyIncome * 30;

    // 2. Essential expenses
    const essentialExpenses = 12000; 

    // 3. Existing obligations (from db)
    const activeLoans = await this.prisma.loan.findMany({
      where: { userId, status: { not: 'repaid' } }
    });
    const existingObligations = activeLoans.reduce((sum, loan) => sum + (loan.totalDue - loan.amountRepaid), 0);

    // 4. Available surplus
    const availableSurplus = monthlyIncome - essentialExpenses - existingObligations;
    
    let riskLevel = 'HIGH_RISK';
    let alternativeAmount = 0;

    if (requestedAmount < availableSurplus * 0.3) {
      riskLevel = 'SAFE';
      alternativeAmount = requestedAmount;
    } else if (requestedAmount < availableSurplus * 0.6) {
      riskLevel = 'CAUTION';
      alternativeAmount = Math.floor(availableSurplus * 0.3); // suggest the safe max
    } else {
      riskLevel = 'HIGH_RISK';
      alternativeAmount = Math.floor(availableSurplus * 0.3);
    }

    return {
      riskLevel,
      requestedAmount,
      monthlyIncome,
      essentialExpenses,
      existingObligations,
      availableSurplus,
      explanation: `With a surplus of ₹${availableSurplus}, a loan of ₹${requestedAmount} is considered ${riskLevel.replace('_', ' ')}.`,
      alternativeAmount: riskLevel === 'SAFE' ? null : alternativeAmount
    };
  }
}
