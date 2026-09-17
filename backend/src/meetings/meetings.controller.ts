import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { MeetingsService } from './meetings.service.js';
import { CreateMeetingDto } from './dto/create-meeting.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { CurrentUser } from '../auth/current-user.decorator.js';

@UseGuards(JwtAuthGuard)
@Controller('meetings')
export class MeetingsController {
  constructor(private readonly meetingsService: MeetingsService) {}

  // Crear una reunión programada (agenda)
  @Post()
  create(@CurrentUser() user: any, @Body() dto: CreateMeetingDto) {
    return this.meetingsService.create(user.id, dto);
  }

  // Listar la agenda (reuniones futuras, aún no realizadas)
  @Get('agenda')
  findAgenda(@CurrentUser() user: any) {
    return this.meetingsService.findAgenda(user.id);
  }

  // Listar el historial (reuniones ya finalizadas)
  @Get('history')
  findHistory(@CurrentUser() user: any) {
    return this.meetingsService.findHistory(user.id);
  }

  // Detalle de una reunión puntual
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.meetingsService.findOne(id);
  }
}
