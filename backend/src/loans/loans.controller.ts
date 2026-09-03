import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { LoansService } from './loans.service';
import { JwtAuthGuard } from '../auth/auth.guard';
import { User } from '../auth/user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('loans')
export class LoansController {
  constructor(private readonly loansService: LoansService) {}

  @Post('request')
  requestLoan(@User() user: any, @Body() dto: any) {
    return this.loansService.requestLoan(user.id, dto.amount);
  }

  @Get('active')
  getActiveLoans(@User() user: any) {
    return this.loansService.getActiveLoans(user.id);
  }

  @Get('history')
  getLoanHistory(@User() user: any) {
    return this.loansService.getLoanHistory(user.id);
  }

  @Post(':id/repay')
  repayLoan(@User() user: any, @Param('id') id: string, @Body() dto: any) {
    return this.loansService.repayLoan(user.id, id, dto.amount);
  }

  @Post(':id/rollover')
  rolloverLoan(@Param('id') id: string) {
    // Admin only in real app, simplified for hackathon
    return this.loansService.rolloverLoan(id);
  }
}
