import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { JwtAuthGuard } from '../auth/auth.guard';
import { User } from '../auth/user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  getTransactions(@User() user: any, @Query('type') type: string, @Query('category') category: string, @Query('days') days: number) {
    return this.transactionsService.getTransactions(user.id, type, category, days || 30);
  }

  @Post()
  addTransaction(@User() user: any, @Body() dto: any) {
    return this.transactionsService.addTransaction(user.id, dto);
  }

  @Get('categories')
  getCategories(@User() user: any) {
    return this.transactionsService.getCategories(user.id);
  }
}
