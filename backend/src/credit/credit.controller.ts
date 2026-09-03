import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { CreditService } from './credit.service';
import { JwtAuthGuard } from '../auth/auth.guard';
import { User } from '../auth/user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('credit')
export class CreditController {
  constructor(private readonly creditService: CreditService) {}

  @Post('evaluate')
  evaluateCredit(@User() user: any, @Body() dto: { requestedAmount: number }) {
    return this.creditService.evaluateLoanRequest(user.id, dto.requestedAmount);
  }
}
