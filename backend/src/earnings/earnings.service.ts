import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EarningsService {
  constructor(private prisma: PrismaService) {}

  async getHistory(userId: string, days: number, platform: string) {
    const dateLimit = new Date();
    dateLimit.setDate(dateLimit.getDate() - days);

    const filter: any = { userId, date: { gte: dateLimit } };
    if (platform !== 'all') filter.platform = platform;

    return this.prisma.earningsRecord.findMany({ where: filter, orderBy: { date: 'desc' } });
  }

  async getSummary(userId: string) {
    const records = await this.prisma.earningsRecord.findMany({ where: { userId } });
    const total = records.reduce((sum, r) => sum + r.amount, 0);
    const totalTrips = records.reduce((sum, r) => sum + r.trips, 0);
    const totalHours = records.reduce((sum, r) => sum + r.hoursWorked, 0);
    return { total, avgDaily: records.length ? total / records.length : 0, totalTrips, totalHours };
  }

  async getByPlatform(userId: string) {
    return this.prisma.earningsRecord.groupBy({
      by: ['platform'],
      where: { userId },
      _sum: { amount: true, trips: true, hoursWorked: true }
    });
  }
}
