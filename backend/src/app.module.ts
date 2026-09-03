import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { PlatformsModule } from './platforms/platforms.module';
import { EarningsModule } from './earnings/earnings.module';
import { ScoringModule } from './scoring/scoring.module';
import { SavingsModule } from './savings/savings.module';
import { CreditModule } from './credit/credit.module';
import { LoansModule } from './loans/loans.module';
import { RecommendationsModule } from './recommendations/recommendations.module';
import { ForecastModule } from './forecast/forecast.module';
import { AdminModule } from './admin/admin.module';
import { WebhooksModule } from './webhooks/webhooks.module';
import { TransactionsModule } from './transactions/transactions.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    PlatformsModule,
    EarningsModule,
    ScoringModule,
    SavingsModule,
    CreditModule,
    LoansModule,
    RecommendationsModule,
    ForecastModule,
    AdminModule,
    WebhooksModule,
    TransactionsModule,
    DashboardModule,
  ],
})
export class AppModule {}
