import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SavingsService {
  constructor(private prisma: PrismaService) {}

  async calculateSafeToSave(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    const emergencyBuffer = user?.emergencyBuffer || 5000;

    // In a real app we calculate these from db:
    // const txs = await this.prisma.transaction.findMany(...)
    // Mocking for hackathon to guarantee consistent demo
    const currentBalance = 15000;
    const expectedIncome = 25000;
    const essentialExpenses = 12000;
    
    const activeLoans = await this.prisma.loan.findMany({
      where: { userId, status: { not: 'repaid' } }
    });
    const upcomingObligations = activeLoans.reduce((sum, loan) => sum + (loan.totalDue - loan.amountRepaid), 0);

    const safeDisposableAmount = currentBalance + expectedIncome - essentialExpenses - upcomingObligations - emergencyBuffer;
    const recommendedAmount = Math.max(0, safeDisposableAmount * 0.5);

    return {
      recommendedAmount,
      currentBalance,
      expectedIncome,
      essentialExpenses,
      upcomingObligations,
      emergencyBuffer,
      safeDisposableAmount,
      explanation: `Based on your projected balance of ₹${currentBalance + expectedIncome} minus expenses (₹${essentialExpenses}) and loan dues (₹${upcomingObligations}), saving 50% of your disposable income (₹${recommendedAmount.toFixed(0)}) is safe.`
    };
  }
}
