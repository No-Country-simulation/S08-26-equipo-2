import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { MeetingStatus } from '@prisma/client';
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
          include: { user: true },
        },
      },
      orderBy: { actualEndAt: 'desc' },
    });
  }

  // Detalle de una reunión puntual
  async findOne(id: string) {
    const meeting = await this.prisma.meeting.findUnique({
      where: { id },
      include: { participants: { include: { user: true } } },
    });
    if (!meeting) throw new NotFoundException('Reunión no encontrada');
    return meeting;
  }
}
