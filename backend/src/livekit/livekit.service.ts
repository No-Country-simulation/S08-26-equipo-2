import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  AccessToken,
  TrackSource,
  WebhookEvent,
  WebhookReceiver,
} from 'livekit-server-sdk';
import {
  AccessRequestStatus,
  ConnectionStatus,
  MeetingStatus,
  Prisma,
  UserRole,
} from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';

export interface LivekitTokenResult {
  token: string;
  url: string;
  room: string;
  identity: string;
}

const ROOM_PREFIX = 'meeting_';

function buildRoomName(meetingCode: string): string {
  return `${ROOM_PREFIX}${meetingCode}`;
}

function roomNameToCode(roomName: string): string {
  return roomName.startsWith(ROOM_PREFIX)
    ? roomName.slice(ROOM_PREFIX.length)
    : roomName;
}

@Injectable()
export class LivekitService {
  private readonly apiKey: string;
  private readonly apiSecret: string;
  private readonly url: string;
  private readonly receiver: WebhookReceiver;

  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    this.apiKey = this.config.get<string>('LIVEKIT_API_KEY') ?? '';
    this.apiSecret = this.config.get<string>('LIVEKIT_API_SECRET') ?? '';
    this.url = this.config.get<string>('LIVEKIT_URL') ?? '';
    this.receiver = new WebhookReceiver(this.apiKey, this.apiSecret);
  }

  // Valida que el usuario tenga acceso a la reunión y genera su token
  async createTokenForUser(
    meetingId: string,
    user: { id: string; fullName: string },
  ): Promise<LivekitTokenResult> {
    const meeting = await this.authorizeRoom(meetingId, user.id);
    return this.generateToken({
      userId: user.id,
      fullName: user.fullName,
      meetingCode: meeting.code,
      role: meeting.hostId === user.id ? UserRole.HOST : UserRole.PARTICIPANT,
    });
  }

  // Tarea 1: verifica los permisos de acceso a una reunión aprobada
  private async authorizeRoom(meetingId: string, userId: string) {
    const meeting = await this.prisma.meeting.findUnique({
      where: { id: meetingId },
    });
    if (!meeting) {
      throw new NotFoundException('Reunión no encontrada');
    }

    const isHost = meeting.hostId === userId;
    const participant = await this.prisma.meetingParticipant.findUnique({
      where: { meetingId_userId: { meetingId, userId } },
      select: { id: true },
    });
    const approved = await this.prisma.accessRequest.findFirst({
      where: {
        meetingId,
        userId,
        status: AccessRequestStatus.APPROVED,
      },
      select: { id: true },
    });

    if (!isHost && !participant && !approved) {
      throw new ForbiddenException(
        'No tienes acceso a esta reunión (espera la aprobación del anfitrión)',
      );
    }

    return meeting;
  }

  // Tarea 1: genera el token de acceso a la sala de LiveKit
  async generateToken(params: {
    userId: string;
    fullName: string;
    meetingCode: string;
    role: UserRole;
  }): Promise<LivekitTokenResult> {
    const { userId, fullName, meetingCode } = params;
    const room = buildRoomName(meetingCode);

    const token = new AccessToken(this.apiKey, this.apiSecret, {
      identity: userId,
      name: fullName,
      ttl: '10m',
    });

    // Tarea 3: permisos nativos de LiveKit (micrófono, cámara, pantalla, chat)
    token.addGrant({
      room,
      roomJoin: true,
      canPublish: true,
      canSubscribe: true,
      canPublishData: true,
      canUpdateOwnMetadata: true,
    });

    const jwt = await token.toJwt();

    return { token: jwt, url: this.url, room, identity: userId };
  }

  // Tarea 2: valida la firma y parsea un webhook de LiveKit Cloud
  receiveWebhook(body: string, authorization?: string): Promise<WebhookEvent> {
    if (!authorization) {
      throw new Error('authorization header is empty');
    }
    return this.receiver.receive(body, authorization);
  }

  // Tarea 2: aplica cada evento del webhook a la base de datos
  async handleWebhookEvent(event: WebhookEvent): Promise<void> {
    const eventName: string = event.event;
    const roomName = event.room?.name;
    if (!roomName) return;

    const meeting = await this.prisma.meeting.findUnique({
      where: { code: roomNameToCode(roomName) },
      select: { id: true, hostId: true },
    });
    if (!meeting) return;

    const now = new Date();

    switch (eventName) {
      case 'room_started':
        await this.prisma.meeting.update({
          where: { id: meeting.id },
          data: {
            status: MeetingStatus.IN_PROGRESS,
            actualStartAt: now,
          },
        });
        break;

      case 'room_finished':
        await this.prisma.$transaction(async (tx) => {
          await tx.meeting.update({
            where: { id: meeting.id },
            data: {
              status: MeetingStatus.FINISHED,
              actualEndAt: now,
            },
          });
          await tx.meetingParticipant.updateMany({
            where: { meetingId: meeting.id, leftAt: null },
            data: {
              connectionStatus: ConnectionStatus.LEFT,
              leftAt: now,
            },
          });
        });
        break;

      case 'participant_joined': {
        const identity = event.participant?.identity;
        if (!identity) break;
        await this.upsertParticipant(
          meeting.id,
          identity,
          meeting.hostId === identity,
          { connectionStatus: ConnectionStatus.CONNECTED, joinedAt: now },
        );
        break;
      }

      case 'participant_disconnected': {
        const identity = event.participant?.identity;
        if (!identity) break;
        // Estado transitorio: LiveKit reconecta de forma nativa y
        // 'participant_joined' lo devolverá a CONNECTED.
        await this.prisma.meetingParticipant.updateMany({
          where: { meetingId: meeting.id, userId: identity },
          data: { connectionStatus: ConnectionStatus.DISCONNECTED },
        });
        break;
      }

      case 'participant_left':
      case 'participant_connection_aborted': {
        const identity = event.participant?.identity;
        if (!identity) break;
        await this.prisma.meetingParticipant.updateMany({
          where: { meetingId: meeting.id, userId: identity },
          data: {
            connectionStatus: ConnectionStatus.LEFT,
            leftAt: now,
          },
        });
        break;
      }

      case 'track_published':
      case 'track_unpublished':
      case 'track_muted':
      case 'track_unmuted': {
        const identity = event.participant?.identity;
        const source = event.track?.source;
        if (!identity || source === undefined) break;
        const enabled =
          eventName === 'track_published' || eventName === 'track_unmuted';
        await this.updateMediaState(meeting.id, identity, source, enabled);
        break;
      }
    }
  }

  // Asegura que exista (y actualiza) el participante en la reunión
  private async upsertParticipant(
    meetingId: string,
    userId: string,
    isHost: boolean,
    data: { connectionStatus: ConnectionStatus; joinedAt?: Date },
  ): Promise<void> {
    await this.prisma.meetingParticipant.upsert({
      where: { meetingId_userId: { meetingId, userId } },
      create: {
        meetingId,
        userId,
        role: isHost ? UserRole.HOST : UserRole.PARTICIPANT,
        connectionStatus: data.connectionStatus,
        joinedAt: data.joinedAt ?? new Date(),
      },
      update: {
        connectionStatus: data.connectionStatus,
        joinedAt: data.joinedAt,
        lastPingAt: new Date(),
      },
    });
  }

  // Tarea 3: sincroniza el estado de medios del participante desde los eventos
  private async updateMediaState(
    meetingId: string,
    userId: string,
    source: TrackSource,
    enabled: boolean,
  ): Promise<void> {
    let data: Prisma.MeetingParticipantUpdateManyMutationInput = {};

    if (source === TrackSource.MICROPHONE) {
      data.isMicOn = enabled;
    } else if (source === TrackSource.CAMERA) {
      data.isCameraOn = enabled;
    } else if (
      source === TrackSource.SCREEN_SHARE ||
      source === TrackSource.SCREEN_SHARE_AUDIO
    ) {
      data.isScreenSharing = enabled;
    } else {
      return;
    }

    await this.prisma.meetingParticipant.updateMany({
      where: { meetingId, userId },
      data,
    });
  }
}