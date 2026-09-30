import { Module } from '@nestjs/common';
import { AccessRequestsService } from './access-requests.service.js';
import { AccessRequestsController } from './access-requests.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [AccessRequestsController],
  providers: [AccessRequestsService],
})
export class AccessRequestsModule {}
