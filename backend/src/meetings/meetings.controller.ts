import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { MeetingsService } from './meetings.service.js';
import { CreateMeetingDto } from './dto/create-meeting.dto.js';
import {
  MeetingDto,
  MeetingParticipantDto,
  MeetingWithParticipantsDto,
} from './dto/meeting.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { CurrentUser } from '../auth/current-user.decorator.js';

@ApiTags('meetings')
@UseGuards(JwtAuthGuard)
@Controller('meetings')
export class MeetingsController {
  constructor(private readonly meetingsService: MeetingsService) {}

  // Crear una reunión programada (agenda)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear una reunión programada' })
  @ApiCreatedResponse({
    description: 'Reunión creada correctamente.',
    type: MeetingDto,
  })
  @ApiUnauthorizedResponse({ description: 'Access token inválido o ausente' })
  create(@CurrentUser() user: any, @Body() dto: CreateMeetingDto) {
    return this.meetingsService.create(user.id, dto);
  }

  // Listar la agenda (reuniones futuras, aún no realizadas)
  @Get('agenda')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar la agenda de reuniones programadas' })
  @ApiOkResponse({
    description: 'Reuniones programadas (aún no realizadas) del usuario.',
    type: [MeetingDto],
  })
  @ApiUnauthorizedResponse({ description: 'Access token inválido o ausente' })
  findAgenda(@CurrentUser() user: any) {
    return this.meetingsService.findAgenda(user.id);
  }

  // Listar el historial (reuniones ya finalizadas)
  @Get('history')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar el historial de reuniones finalizadas' })
  @ApiOkResponse({
    description: 'Reuniones finalizadas del usuario, con sus participantes.',
    type: [MeetingWithParticipantsDto],
  })
  @ApiUnauthorizedResponse({ description: 'Access token inválido o ausente' })
  findHistory(@CurrentUser() user: any) {
    return this.meetingsService.findHistory(user.id);
  }

  // Cerrar una reunión
  @Patch(':id/close')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cerrar una reunión en curso' })
  @ApiOkResponse({
    description: 'Reunión finalizada correctamente.',
    type: MeetingDto,
  })
  @ApiNotFoundResponse({ description: 'Reunión no encontrada' })
  @ApiForbiddenResponse({ description: 'Solo el host puede cerrar la reunión' })
  @ApiUnauthorizedResponse({ description: 'Access token inválido o ausente' })
  close(@Param('id') id: string, @CurrentUser() user: any) {
    return this.meetingsService.close(id, user.id);
  }

  // Listar participantes actuales de la reunión
  @Get(':id/participants')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar los participantes de una reunión' })
  @ApiOkResponse({
    description: 'Participantes actuales de la reunión.',
    type: [MeetingParticipantDto],
  })
  @ApiNotFoundResponse({ description: 'Reunión no encontrada' })
  @ApiForbiddenResponse({ description: 'No perteneces a esta reunión' })
  @ApiUnauthorizedResponse({ description: 'Access token inválido o ausente' })
  findParticipants(@Param('id') id: string, @CurrentUser() user: any) {
    return this.meetingsService.findParticipants(id, user.id);
  }

  // Salir voluntariamente de la reunión
  @Patch(':id/leave')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Salir voluntariamente de una reunión' })
  @ApiOkResponse({
    description: 'Participante marcado como salido de la reunión.',
    type: MeetingParticipantDto,
  })
  @ApiNotFoundResponse({
    description: 'Reunión no encontrada, o no estás actualmente en esta reunión',
  })
  @ApiUnauthorizedResponse({ description: 'Access token inválido o ausente' })
  leave(@Param('id') id: string, @CurrentUser() user: any) {
    return this.meetingsService.leave(id, user.id);
  }

  // Detalle de una reunión puntual
  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener el detalle de una reunión' })
  @ApiOkResponse({
    description: 'Detalle de la reunión con sus participantes.',
    type: MeetingWithParticipantsDto,
  })
  @ApiNotFoundResponse({ description: 'Reunión no encontrada' })
  @ApiUnauthorizedResponse({ description: 'Access token inválido o ausente' })
  findOne(@Param('id') id: string) {
    return this.meetingsService.findOne(id);
  }
}
