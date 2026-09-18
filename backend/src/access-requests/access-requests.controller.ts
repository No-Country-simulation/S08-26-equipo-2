import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AccessRequestsService } from './access-requests.service.js';
import {
  AccessRequestDto,
  AccessRequestWithUserDto,
} from './dto/access-request.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { CurrentUser } from '../auth/current-user.decorator.js';

@ApiTags('access-requests')
@UseGuards(JwtAuthGuard)
@Controller('meetings/:meetingId/access-requests')
export class AccessRequestsController {
  constructor(private readonly accessRequestsService: AccessRequestsService) {}

  // Un participante pide entrar a la reunión
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Solicitar ingreso a una reunión' })
  @ApiCreatedResponse({
    description: 'Solicitud de ingreso creada correctamente.',
    type: AccessRequestDto,
  })
  @ApiNotFoundResponse({ description: 'Reunión no encontrada' })
  @ApiConflictResponse({
    description: 'Ya existe una solicitud pendiente para esta reunión',
  })
  @ApiUnauthorizedResponse({ description: 'Access token inválido o ausente' })
  requestAccess(
    @Param('meetingId') meetingId: string,
    @CurrentUser() user: any,
  ) {
    return this.accessRequestsService.requestAccess(meetingId, user.id);
  }

  // El host ve las solicitudes pendientes
  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar las solicitudes de ingreso pendientes' })
  @ApiOkResponse({
    description: 'Solicitudes pendientes de la reunión, con el usuario solicitante.',
    type: [AccessRequestWithUserDto],
  })
  @ApiNotFoundResponse({ description: 'Reunión no encontrada' })
  @ApiForbiddenResponse({
    description: 'Solo el host puede gestionar solicitudes de ingreso',
  })
  @ApiUnauthorizedResponse({ description: 'Access token inválido o ausente' })
  findPending(
    @Param('meetingId') meetingId: string,
    @CurrentUser() user: any,
  ) {
    return this.accessRequestsService.findPending(meetingId, user.id);
  }

  // El host aprueba una solicitud
  @Patch(':id/approve')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Aprobar una solicitud de ingreso' })
  @ApiOkResponse({
    description: 'Solicitud aprobada y participante agregado a la reunión.',
    type: AccessRequestDto,
  })
  @ApiNotFoundResponse({
    description: 'Reunión no encontrada, o solicitud no encontrada o ya procesada',
  })
  @ApiForbiddenResponse({
    description: 'Solo el host puede gestionar solicitudes de ingreso',
  })
  @ApiUnauthorizedResponse({ description: 'Access token inválido o ausente' })
  approve(
    @Param('meetingId') meetingId: string,
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    return this.accessRequestsService.approve(meetingId, id, user.id);
  }

  // El host rechaza una solicitud
  @Patch(':id/reject')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Rechazar una solicitud de ingreso' })
  @ApiOkResponse({
    description: 'Solicitud rechazada correctamente.',
    type: AccessRequestDto,
  })
  @ApiNotFoundResponse({
    description: 'Reunión no encontrada, o solicitud no encontrada o ya procesada',
  })
  @ApiForbiddenResponse({
    description: 'Solo el host puede gestionar solicitudes de ingreso',
  })
  @ApiUnauthorizedResponse({ description: 'Access token inválido o ausente' })
  reject(
    @Param('meetingId') meetingId: string,
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    return this.accessRequestsService.reject(meetingId, id, user.id);
  }
}
