import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { UsersModule } from './users/users.module.js';
import { RoomsModule } from './rooms/rooms.module.js';
import { MeetingsModule } from './meetings/meetings.module.js';

@Module({
  imports: [UsersModule, RoomsModule, MeetingsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
