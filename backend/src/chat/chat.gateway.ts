import { Logger, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import type { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service.js';
import { JoinRoomChatDto } from './dto/join-room.dto.js';
import { SendMessageDto } from './dto/send-message.dto.js';
import {
  AuthenticatedSocket,
  extractTokenFromSocket,
  WsJwtAuthGuard,
} from './ws-jwt-auth.guard.js';

const ROOM_PREFIX = 'meeting:';

function roomFor(meetingId: string): string {
  return `${ROOM_PREFIX}${meetingId}`;
}

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL ?? 'http://localhost:5173',
  },
  transports: ['websocket', 'polling'],
})
export class ChatGateway implements OnGatewayConnection {
  private readonly logger = new Logger(ChatGateway.name);

  @WebSocketServer()
  server!: Server;

  constructor(
    private readonly chatService: ChatService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  // Tarea 4: autentica el handshake (JWT) y adjunta el usuario a socket.data.
  // Nota: el handshake es asíncrono y socket.io no lo espera; el guard
  // (WsJwtAuthGuard) re-verifica el token en cada evento como fuente de verdad.
  async handleConnection(client: Socket): Promise<void> {
    try {
      const token = extractTokenFromSocket(client);
      if (!token) {
        throw new Error('Token no proporcionado');
      }

      const payload = await this.jwtService.verifyAsync<{
        sub: string;
        type: string;
      }>(token, {
        secret: this.config.get<string>('JWT_SECRET') ?? 'change-me',
      });
      if (payload.type !== 'access') {
        throw new Error('Token inválido');
      }

      const user = await this.chatService.findUserPublic(payload.sub);
      if (!user) {
        throw new Error('Usuario no encontrado');
      }

      (client as AuthenticatedSocket).data.user = user;
    } catch (err) {
      this.logger.warn(
        `Conexión rechazada: ${err instanceof Error ? err.message : 'Token inválido'}`,
      );
      client.emit('chat:error', { message: 'No autorizado' });
      client.disconnect(true);
    }
  }

  // Unirse a la sala de la reunión para recibir sus mensajes
  @SubscribeMessage('join_room')
  @UseGuards(WsJwtAuthGuard)
  async joinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() dto: JoinRoomChatDto,
  ) {
    const { user } = (client as AuthenticatedSocket).data;
    await this.chatService.authorizeMember(dto.meetingId, user.id);
    await client.join(roomFor(dto.meetingId));
    return { event: 'chat:joined', data: { meetingId: dto.meetingId } };
  }

  // Enviar un mensaje: se persiste y se difunde a toda la sala
  @SubscribeMessage('send_message')
  @UseGuards(WsJwtAuthGuard)
  async sendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() dto: SendMessageDto,
  ) {
    const { user } = (client as AuthenticatedSocket).data;
    const message = await this.chatService.createMessage(
      dto.meetingId,
      user.id,
      dto.message,
    );
    this.server.to(roomFor(dto.meetingId)).emit('chat:message', message);
    return { event: 'chat:sent', data: { id: message.id } };
  }
}