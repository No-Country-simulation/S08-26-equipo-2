import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { ChatGateway } from './chat.gateway.js';
import { ChatService } from './chat.service.js';
import { WsJwtAuthGuard } from './ws-jwt-auth.guard.js';

@Module({
  imports: [PrismaModule, AuthModule],
  providers: [ChatGateway, ChatService, WsJwtAuthGuard],
  exports: [ChatService],
})
export class ChatModule {}