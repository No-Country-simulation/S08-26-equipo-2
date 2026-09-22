import { Body, Controller, HttpCode, Logger, Post, Req, UseGuards } from '@nestjs/common';
import type { RawBodyRequest } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiForbiddenResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { CurrentUser, type AuthUser } from '../auth/current-user.decorator.js';
import { JoinLivekitDto } from './dto/join-livekit.dto.js';
import { LivekitTokenResponseDto } from './dto/livekit-token-response.dto.js';
import { LivekitService } from './livekit.service.js';

@ApiTags('livekit')
@Controller('livekit')
export class LivekitController {
  private readonly logger = new Logger(LivekitController.name);

  constructor(private readonly livekitService: LivekitService) {}

  // Tarea 1: genera el token de acceso a la sala de LiveKit
  @Post('token')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Generar token de acceso a la sala de LiveKit' })
  @ApiCreatedResponse({
    description: 'Token generado para entrar a la reunión aprobada.',
    type: LivekitTokenResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Access token inválido o ausente' })
  @ApiForbiddenResponse({
    description: 'No tienes acceso a esta reunión (solicitud pendiente o rechazada)',
  })
  token(@CurrentUser() user: AuthUser, @Body() dto: JoinLivekitDto) {
    return this.livekitService.createTokenForUser(dto.meetingId, user);
  }

  // Tarea 2: recibe los webhooks de LiveKit Cloud y sincroniza la base de datos
  @HttpCode(200)
  @Post('webhook')
  @ApiOperation({ summary: 'Recibir webhooks de LiveKit Cloud' })
  @ApiOkResponse({ description: 'Evento procesado correctamente.' })
  async webhook(@Req() req: RawBodyRequest<Request>) {
    // Prioridad: parser raw (Buffer) → rawBody de Nest → re-serialización
    const rawBody = Buffer.isBuffer(req.body)
      ? req.body.toString('utf8')
      : req.rawBody
        ? req.rawBody.toString('utf8')
        : JSON.stringify(req.body ?? {});

    // LiveKit envía la firma en el header 'Authorize' (a veces 'Authorization')
    const header =
      (req.headers['authorization'] as string | undefined) ??
      (req.headers['authorize'] as string | undefined);
    const authorization = header?.startsWith('Bearer ') ? header.slice(7) : header;

    const event = await this.livekitService.receiveWebhook(rawBody, authorization);
    this.logger.log(`Webhook recibido: ${event.event}`);
    await this.livekitService.handleWebhookEvent(event);
    return { received: true };
  }
}