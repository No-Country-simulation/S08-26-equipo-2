import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { MeetingStatus, ConnectionStatus } from '@prisma/client';
import { CreateMeetingDto } from './dto/create-meeting.dto.js';

@Injectable()
export class MeetingsService {
  constructor(private readonly prisma: PrismaService) {}

  // Agenda: crear una reunión programada para el futuro
  async create(hostId: string, dto: CreateMeetingDto) {
    return this.prisma.meeting.create({
      data: {
        code: crypto.randomUUID().slice(0, 8),
        title: dto.title,
        description: dto.description,
        hostId,
        scheduledStartAt: dto.scheduledStartAt,
        scheduledEndAt: dto.scheduledEndAt,
        estimatedDurationMinutes: dto.estimatedDurationMinutes,
      },
    });
  }

  // Agenda: listar reuniones programadas (aún no realizadas)
  async findAgenda(hostId: string) {
    return this.prisma.meeting.findMany({
      where: {
        hostId,
        status: MeetingStatus.SCHEDULED,
      },
      orderBy: { scheduledStartAt: 'asc' },
    });
  }

  // Historial: listar reuniones ya finalizadas, con participantes
  async findHistory(hostId: string) {
    return this.prisma.meeting.findMany({
      where: {
        hostId,
        status: MeetingStatus.FINISHED,
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                email: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
      orderBy: { actualEndAt: 'desc' },
    });
  }

  // Cerrar una reunión: la marca como finalizada
  async close(id: string, hostId: string) {
    const meeting = await this.prisma.meeting.findUnique({ where: { id } });
    if (!meeting) throw new NotFoundException('Reunión no encontrada');
    if (meeting.hostId !== hostId) {
      throw new ForbiddenException('Solo el host puede cerrar la reunión');
    }

    return this.prisma.$transaction(async (tx) => {
      const closed = await tx.meeting.update({
        where: { id },
        data: {
          status: MeetingStatus.FINISHED,
          actualEndAt: new Date(),
        },
      });

      await tx.meetingParticipant.updateMany({
        where: { meetingId: id, leftAt: null },
        data: {
          leftAt: new Date(),
          connectionStatus: ConnectionStatus.LEFT,
        },
      });

      return closed;
    });
  }

  // Listar participantes actuales de una reunión
  async findParticipants(meetingId: string, requesterId: string) {
    const meeting = await this.prisma.meeting.findUnique({
      where: { id: meetingId },
    });
    if (!meeting) throw new NotFoundException('Reunión no encontrada');

    const isHost = meeting.hostId === requesterId;
    const isParticipant = await this.prisma.meetingParticipant.findFirst({
      where: { meetingId, userId: requesterId },
    });
    if (!isHost && !isParticipant) {
      throw new ForbiddenException('No perteneces a esta reunión');
    }

    return this.prisma.meetingParticipant.findMany({
      where: { meetingId },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: { joinedAt: 'asc' },
    });
  }

  // Un participante sale voluntariamente de la reunión
  async leave(meetingId: string, userId: string) {
    const participant = await this.prisma.meetingParticipant.findFirst({
      where: { meetingId, userId, leftAt: null },
    });
    if (!participant) {
      throw new NotFoundException('No estás actualmente en esta reunión');
    }

    return this.prisma.meetingParticipant.update({
      where: { id: participant.id },
      data: {
        leftAt: new Date(),
        connectionStatus: ConnectionStatus.LEFT,
      },
    });
  }

  // Detalle de una reunión puntual
  async findOne(id: string) {
    const meeting = await this.prisma.meeting.findUnique({
      where: { id },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                email: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
    });
    if (!meeting) throw new NotFoundException('Reunión no encontrada');
    return meeting;
  }
}
