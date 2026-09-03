import { Module } from '@nestjs/common';
import { PlatformsController } from './platforms.controller';
import { PlatformsService } from './platforms.service';

@Module({
  controllers: [PlatformsController],
  providers: [PlatformsService],
  exports: [PlatformsService],
})
export class PlatformsModule {}
