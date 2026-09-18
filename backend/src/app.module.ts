import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { UsersModule } from './users/users.module.js';
import { RoomsModule } from './rooms/rooms.module.js';
import { MeetingsModule } from './meetings/meetings.module.js';
import { AuthModule } from './auth/auth.module.js';
import { AccessRequestsModule } from './access-requests/access-requests.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    UsersModule,
    RoomsModule,
    MeetingsModule,
    AuthModule,
    AccessRequestsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
