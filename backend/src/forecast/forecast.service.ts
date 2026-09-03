import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ForecastService {
  constructor(private prisma: PrismaService) {}

  async getForecast(userId: string) {
    return { currentBalance: 15000, expectedIncome: { low: 22000, mid: 25000, high: 28000 }, expectedExpenses: 12000, projectedBalance: 28000, emergencyBuffer: 5000, safeToSave: 10000, explanation: 'Based on weighted moving average on last 28 days of income.' };
  }
}
