import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LoansService {
  constructor(private prisma: PrismaService) {}

  async requestLoan(userId: string, amount: number) {
    const connections = await this.prisma.platformConnection.findMany({
      where: { userId, status: 'linked' }
    });
    
    if (connections.length === 0) {
      throw new BadRequestException('Please re-link at least one platform to maintain loan eligibility.');
    }
    
    const now = new Date();
    const graceDeadline = new Date(now);
    graceDeadline.setDate(now.getDate() + 5);

    return this.prisma.loan.create({
      data: {
        userId,
        principal: amount,
        totalDue: amount,
        riskLevel: 'safe',
        status: 'disbursed',
        disbursedAt: now,
        graceDeadline: graceDeadline
      }
    });
  }

  async getActiveLoans(userId: string) {
    const loans = await this.prisma.loan.findMany({
      where: { userId, status: { not: 'repaid' } }
    });
    
    const now = new Date();
    return loans.map(loan => {
      const daysUntilDeadline = Math.ceil((loan.graceDeadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      let nextEscalation = '';
      
      if (loan.status === 'disbursed') {
        nextEscalation = `Grace period ends in ${daysUntilDeadline} days`;
      } else if (loan.status === 'overdue') {
        nextEscalation = `Will rollover at month end`;
      } else if (loan.status === 'rolled_over') {
        nextEscalation = `Warning: Next failure will result in account block`;
      }

      return {
        ...loan,
        daysUntilDeadline,
        nextEscalation
      };
    });
  }

  async getLoanHistory(userId: string) {
    return this.prisma.loan.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
  }

  async repayLoan(userId: string, loanId: string, amount: number) {
    const loan = await this.prisma.loan.findUnique({ where: { id: loanId, userId } });
    if (!loan) throw new NotFoundException('Loan not found');
    if (loan.status === 'repaid') throw new BadRequestException('Loan is already repaid');

    const newAmountRepaid = loan.amountRepaid + amount;
    const isRepaid = newAmountRepaid >= loan.totalDue;
    
    const updatedLoan = await this.prisma.loan.update({
      where: { id: loanId },
      data: {
        amountRepaid: newAmountRepaid,
        status: isRepaid ? 'repaid' : loan.status,
        repaidAt: isRepaid ? new Date() : null
      }
    });

    await this.prisma.loanRepayment.create({
      data: { loanId, amount, method: 'manual', paidAt: new Date() }
    });

    return updatedLoan;
  }

  async rolloverLoan(loanId: string) {
    const loan = await this.prisma.loan.findUnique({ where: { id: loanId } });
    if (!loan) throw new NotFoundException('Loan not found');
    if (loan.status !== 'overdue') throw new BadRequestException('Only overdue loans can be rolled over');

    return this.prisma.loan.update({
      where: { id: loanId },
      data: {
        status: 'rolled_over',
        rolledOverAt: new Date(),
        totalDue: loan.totalDue * 1.05
      }
    });
  }
}
