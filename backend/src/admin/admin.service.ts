import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getUsers() { return this.prisma.user.findMany({ include: { _count: { select: { platformConnections: true, loans: true } } } }); }
  async getUserDetails(id: string) { return this.prisma.user.findUnique({ where: { id }, include: { platformConnections: true, loans: true, resilienceScores: true } }); }
  async getLoans() { return this.prisma.loan.findMany({ include: { user: true } }); }
  async getAnalytics() { const totalUsers = await this.prisma.user.count(); return { totalUsers, totalDisbursed: 50000, repaymentRate: 95, avgResilienceScore: 78 }; }
  async overrideLoanStatus(id: string) { return this.prisma.loan.update({ where: { id }, data: { status: 'repaid' } }); }
}
