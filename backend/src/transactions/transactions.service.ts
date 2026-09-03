import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}

  async getTransactions(userId: string, type: string, category: string, days: number) {
    const dateLimit = new Date();
    dateLimit.setDate(dateLimit.getDate() - days);

    const filter: any = { userId, date: { gte: dateLimit } };
    if (type && type !== 'all') filter.type = type;
    if (category && category !== 'all') filter.category = category;

    return this.prisma.transaction.findMany({ where: filter, orderBy: { date: 'desc' } });
  }

  async addTransaction(userId: string, dto: any) {
    return this.prisma.transaction.create({ data: { userId, amount: dto.amount, type: dto.type, category: dto.category, source: dto.source || 'manual_entry', note: dto.note, date: dto.date ? new Date(dto.date) : new Date() } });
  }

  async getCategories(userId: string) {
    return this.prisma.transaction.groupBy({ by: ['category'], where: { userId, type: 'expense' }, _sum: { amount: true } });
  }
}
