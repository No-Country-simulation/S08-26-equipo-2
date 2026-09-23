import { Module } from '@nestjs/common';
import { MeetingsService } from './meetings.service.js';
import { MeetingsController } from './meetings.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { AuthModule } from '../auth/auth.module.js';
import { ChatModule } from '../chat/chat.module.js';

@Module({
  imports: [PrismaModule, AuthModule, ChatModule],
  controllers: [MeetingsController],
  providers: [MeetingsService],
})
export class MeetingsModule {}
