import { Controller, Get, Post, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { PlatformsService } from './platforms.service';
import { JwtAuthGuard } from '../auth/auth.guard';
import { User } from '../auth/user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('platforms')
export class PlatformsController {
  constructor(private readonly platformsService: PlatformsService) {}

  @Post('link')
  linkPlatform(@User() user: any, @Body() dto: any) {
    return this.platformsService.linkPlatform(user.id, dto);
  }

  @Get()
  getPlatforms(@User() user: any) {
    return this.platformsService.getPlatforms(user.id);
  }

  @Delete(':id')
  unlinkPlatform(@User() user: any, @Param('id') id: string) {
    return this.platformsService.unlinkPlatform(user.id, id);
  }

  @Get('health')
  getHealthStatus(@User() user: any) {
    return this.platformsService.getHealthStatus(user.id);
  }
}
