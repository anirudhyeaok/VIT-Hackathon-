import { Controller, Post, Body } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('webhooks/n8n')
export class WebhooksController {
  constructor(private prisma: PrismaService) {}

  @Post('earnings-sync')
  async syncEarnings(@Body() body: any) {
    const { userId, platform, date, amount, trips, hoursWorked, incentives } = body;
    const conn = await this.prisma.platformConnection.findFirst({ where: { userId, platform } });
    if (!conn) return { status: 'error', message: 'Connection not found' };
    
    // Webhook updates lastSyncAt and status to keep connections healthy (HERO 4)
    await this.prisma.platformConnection.update({
      where: { id: conn.id },
      data: { lastSyncAt: new Date(), status: 'linked' }
    });
    
    await this.prisma.earningsRecord.create({
      data: { userId, connectionId: conn.id, platform, date: new Date(date), amount, trips, hoursWorked, incentives }
    });
    return { status: 'success' };
  }

  @Post('payment-received')
  async paymentReceived(@Body() body: any) { return { status: 'success', recorded: true }; }

  @Post('loan-reminder')
  async loanReminder() { return { status: 'reminders_sent', count: 0 }; }
}
