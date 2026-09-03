import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { RecommendationsService } from './recommendations.service';
import { JwtAuthGuard } from '../auth/auth.guard';
import { User } from '../auth/user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('recommendations')
export class RecommendationsController {
  constructor(private readonly recommendationsService: RecommendationsService) {}

  @Get()
  getRecommendations(@User() user: any) {
    return this.recommendationsService.getActiveRecommendations(user.id);
  }

  @Post('generate')
  generate(@User() user: any) {
    return this.recommendationsService.generateRecommendations(user.id);
  }
}
