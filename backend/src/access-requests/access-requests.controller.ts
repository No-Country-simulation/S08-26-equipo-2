import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  UseGuards,
} from '@nestjs/common';
import { AccessRequestsService } from './access-requests.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { CurrentUser } from '../auth/current-user.decorator.js';

@UseGuards(JwtAuthGuard)
@Controller('meetings/:meetingId/access-requests')
export class AccessRequestsController {
  constructor(private readonly accessRequestsService: AccessRequestsService) {}

  // Un participante pide entrar a la reunión
  @Post()
  requestAccess(
    @Param('meetingId') meetingId: string,
    @CurrentUser() user: any,
  ) {
    return this.accessRequestsService.requestAccess(meetingId, user.id);
  }

  // El host ve las solicitudes pendientes
  @Get()
  findPending(
    @Param('meetingId') meetingId: string,
    @CurrentUser() user: any,
  ) {
    return this.accessRequestsService.findPending(meetingId, user.id);
  }

  // El host aprueba una solicitud
  @Patch(':id/approve')
  approve(
    @Param('meetingId') meetingId: string,
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    return this.accessRequestsService.approve(meetingId, id, user.id);
  }

  // El host rechaza una solicitud
  @Patch(':id/reject')
  reject(
    @Param('meetingId') meetingId: string,
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    return this.accessRequestsService.reject(meetingId, id, user.id);
  }
}
