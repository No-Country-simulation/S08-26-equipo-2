import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.js';
import { AuthModule } from '../auth/auth.module.js';
import { LivekitController } from './livekit.controller.js';
import { LivekitService } from './livekit.service.js';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [LivekitController],
  providers: [LivekitService],
  exports: [LivekitService],
})
export class LivekitModule {}