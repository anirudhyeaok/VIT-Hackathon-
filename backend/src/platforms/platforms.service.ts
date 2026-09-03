import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PlatformsService {
  constructor(private prisma: PrismaService) {}

  async linkPlatform(userId: string, dto: any) {
    const existing = await this.prisma.platformConnection.findUnique({
      where: { userId_platform: { userId, platform: dto.platform } }
    });
    if (existing) {
      throw new BadRequestException('Platform already linked');
    }
    
    return this.prisma.platformConnection.create({
      data: {
        userId,
        platform: dto.platform,
        platformName: dto.platformName || dto.platform,
        accountId: dto.accountId,
        status: 'linked',
        lastSyncAt: new Date()
      }
    });
  }

  async getPlatforms(userId: string) {
    return this.prisma.platformConnection.findMany({
      where: { userId }
    });
  }

  async unlinkPlatform(userId: string, id: string) {
    return this.prisma.platformConnection.delete({
      where: { id, userId }
    });
  }

  async getHealthStatus(userId: string) {
    const connections = await this.prisma.platformConnection.findMany({
      where: { userId }
    });

    const now = new Date();
    const result = connections.map(conn => {
      const hoursSinceSync = (now.getTime() - conn.lastSyncAt.getTime()) / (1000 * 60 * 60);
      let calculatedStatus = 'linked';
      
      if (hoursSinceSync > 72) {
        calculatedStatus = 'broken';
      } else if (hoursSinceSync > 24) {
        calculatedStatus = 'stale';
      }

      return {
        id: conn.id,
        platform: conn.platform,
        platformName: conn.platformName,
        lastSyncAt: conn.lastSyncAt,
        hoursSinceSync,
        health: calculatedStatus,
        needsAttention: calculatedStatus !== 'linked'
      };
    });

    return {
      total: result.length,
      healthy: result.filter(r => r.health === 'linked').length,
      stale: result.filter(r => r.health === 'stale').length,
      broken: result.filter(r => r.health === 'broken').length,
      details: result
    };
  }
}
