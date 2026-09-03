import { Controller, Get, Post, Param } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('users')
  getUsers() { return this.adminService.getUsers(); }

  @Get('users/:id')
  getUserDetails(@Param('id') id: string) { return this.adminService.getUserDetails(id); }

  @Get('loans')
  getLoans() { return this.adminService.getLoans(); }

  @Get('analytics')
  getAnalytics() { return this.adminService.getAnalytics(); }

  @Post('loans/:id/override')
  overrideLoanStatus(@Param('id') id: string) { return this.adminService.overrideLoanStatus(id); }
}
