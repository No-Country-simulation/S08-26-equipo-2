import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AccessRequestStatus } from '@prisma/client';
import type { ChatMessage, User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import { ChatMessageResponseDto } from './dto/chat-message-response.dto.js';
import type { ChatUser } from './ws-jwt-auth.guard.js';

type MessageSender = Pick<User, 'id' | 'fullName' | 'avatarUrl'>;
type ChatMessageWithSender = ChatMessage & { sender: MessageSender };

export interface ListMessagesOptions {
  before?: string;
  limit?: number;
}

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  async authorizeMember(meetingId: string, userId: string): Promise<void> {
    const meeting = await this.prisma.meeting.findUnique({
      where: { id: meetingId },
      select: { id: true, hostId: true },
    });
    if (!meeting) {
      throw new NotFoundException('Reunión no encontrada');
    }
    if (meeting.hostId === userId) {
      return;
    }

    const [participant, approved] = await Promise.all([
      this.prisma.meetingParticipant.findUnique({
        where: { meetingId_userId: { meetingId, userId } },
        select: { id: true },
      }),
      this.prisma.accessRequest.findFirst({
        where: { meetingId, userId, status: AccessRequestStatus.APPROVED },
        select: { id: true },
      }),
    ]);

    if (!participant && !approved) {
      throw new ForbiddenException(
        'No tienes acceso al chat de esta reunión (espera la aprobación del anfitrión)',
      );
    }
  }

  // Carga los datos públicos del usuario para autenticar el handshake del WebSocket
  async findUserPublic(id: string): Promise<ChatUser | null> {
    return this.prisma.user.findUnique({
      where: { id },
      select: { id: true, fullName: true, email: true, avatarUrl: true },
    });
  }

  // Tarea 4: persiste un mensaje y lo devuelve listo para emitir a la sala
  async createMessage(
    meetingId: string,
    senderId: string,
    message: string,
  ): Promise<ChatMessageResponseDto> {
    await this.authorizeMember(meetingId, senderId);

    const created = await this.prisma.chatMessage.create({
      data: { meetingId, senderId, message },
      include: {
        sender: { select: { id: true, fullName: true, avatarUrl: true } },
      },
    });

    return this.mapMessage(created);
  }

  // Historial: mensajes anteriores a 'before' (ISO), los más recientes primero
  async listMessages(
    meetingId: string,
    requesterId: string,
    options?: ListMessagesOptions,
  ): Promise<ChatMessageResponseDto[]> {
    await this.authorizeMember(meetingId, requesterId);

    const messages = await this.prisma.chatMessage.findMany({
      where: {
        meetingId,
        ...(options?.before
          ? { sentAt: { lt: new Date(options.before) } }
          : {}),
      },
      include: {
        sender: { select: { id: true, fullName: true, avatarUrl: true } },
      },
      orderBy: { sentAt: 'desc' },
      take: options?.limit ?? 50,
    });

    return messages.reverse().map((msg) => this.mapMessage(msg));
  }

  private mapMessage(message: ChatMessageWithSender): ChatMessageResponseDto {
    return {
      id: message.id,
      meetingId: message.meetingId,
      sender: {
        id: message.sender.id,
        fullName: message.sender.fullName,
        avatarUrl: message.sender.avatarUrl,
      },
      message: message.message,
      sentAt: message.sentAt,
    };
  }
}