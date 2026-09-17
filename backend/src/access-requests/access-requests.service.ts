import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { AccessRequestStatus, ConnectionStatus, UserRole } from '@prisma/client';

@Injectable()
export class AccessRequestsService {
  constructor(private readonly prisma: PrismaService) {}

  // Un participante solicita ingresar a una reunión
  async requestAccess(meetingId: string, userId: string) {
    const meeting = await this.prisma.meeting.findUnique({
      where: { id: meetingId },
    });
    if (!meeting) throw new NotFoundException('Reunión no encontrada');

    const existing = await this.prisma.accessRequest.findFirst({
      where: { meetingId, userId, status: AccessRequestStatus.PENDING },
    });
    if (existing) {
      throw new ConflictException('Ya tienes una solicitud pendiente para esta reunión');
    }

    return this.prisma.accessRequest.create({
      data: { meetingId, userId },
    });
  }

  // El host ve las solicitudes pendientes de su reunión
  async findPending(meetingId: string, hostId: string) {
    await this.assertHost(meetingId, hostId);

    return this.prisma.accessRequest.findMany({
      where: { meetingId, status: AccessRequestStatus.PENDING },
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
      orderBy: { requestedAt: 'asc' },
    });
  }

  // El host aprueba una solicitud: crea al participante en la reunión
  async approve(meetingId: string, requestId: string, hostId: string) {
    await this.assertHost(meetingId, hostId);
    const request = await this.getPendingOrThrow(meetingId, requestId);

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.accessRequest.update({
        where: { id: requestId },
        data: {
          status: AccessRequestStatus.APPROVED,
          processedBy: hostId,
          processedAt: new Date(),
        },
      });

      await tx.meetingParticipant.create({
        data: {
          meetingId,
          userId: request.userId,
          role: UserRole.PARTICIPANT,
          connectionStatus: ConnectionStatus.CONNECTED,
          joinedAt: new Date(),
        },
      });

      return updated;
    });
  }

  // El host rechaza una solicitud
  async reject(meetingId: string, requestId: string, hostId: string) {
    await this.assertHost(meetingId, hostId);
    await this.getPendingOrThrow(meetingId, requestId);

    return this.prisma.accessRequest.update({
      where: { id: requestId },
      data: {
        status: AccessRequestStatus.REJECTED,
        processedBy: hostId,
        processedAt: new Date(),
      },
    });
  }

  private async assertHost(meetingId: string, hostId: string) {
    const meeting = await this.prisma.meeting.findUnique({
      where: { id: meetingId },
    });
    if (!meeting) throw new NotFoundException('Reunión no encontrada');
    if (meeting.hostId !== hostId) {
      throw new ForbiddenException('Solo el host puede gestionar solicitudes de ingreso');
    }
  }

  private async getPendingOrThrow(meetingId: string, requestId: string) {
    const request = await this.prisma.accessRequest.findFirst({
      where: { id: requestId, meetingId, status: AccessRequestStatus.PENDING },
    });
    if (!request) {
      throw new NotFoundException('Solicitud no encontrada o ya fue procesada');
    }
    return request;
  }
}
