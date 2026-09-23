import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { ChatService } from './chat.service.js';

const prisma = {
  meeting: { findUnique: vi.fn() },
  meetingParticipant: { findUnique: vi.fn() },
  accessRequest: { findFirst: vi.fn() },
  chatMessage: { create: vi.fn(), findMany: vi.fn() },
  user: { findUnique: vi.fn() },
};

describe('ChatService', () => {
  let service: ChatService;

  beforeEach(async () => {
    vi.clearAllMocks();

    const app: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: PrismaService, useValue: prisma },
        ChatService,
      ],
    }).compile();

    service = app.get<ChatService>(ChatService);
  });

  describe('authorizeMember', () => {
    it('permite al host sin más comprobaciones', async () => {
      prisma.meeting.findUnique.mockResolvedValue({ id: 'm1', hostId: 'u1' });

      await expect(service.authorizeMember('m1', 'u1')).resolves.toBeUndefined();
      expect(prisma.meetingParticipant.findUnique).not.toHaveBeenCalled();
    });

    it('lanza NotFound si la reunión no existe', async () => {
      prisma.meeting.findUnique.mockResolvedValue(null);

      await expect(service.authorizeMember('m1', 'u1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('permite a un participante registrado', async () => {
      prisma.meeting.findUnique.mockResolvedValue({ id: 'm1', hostId: 'host' });
      prisma.meetingParticipant.findUnique.mockResolvedValue({ id: 'p1' });
      prisma.accessRequest.findFirst.mockResolvedValue(null);

      await expect(service.authorizeMember('m1', 'u2')).resolves.toBeUndefined();
    });

    it('permite a un usuario con solicitud aprobada', async () => {
      prisma.meeting.findUnique.mockResolvedValue({ id: 'm1', hostId: 'host' });
      prisma.meetingParticipant.findUnique.mockResolvedValue(null);
      prisma.accessRequest.findFirst.mockResolvedValue({ id: 'ar1' });

      await expect(service.authorizeMember('m1', 'u2')).resolves.toBeUndefined();
    });

    it('lanza Forbidden si el usuario no tiene acceso', async () => {
      prisma.meeting.findUnique.mockResolvedValue({ id: 'm1', hostId: 'host' });
      prisma.meetingParticipant.findUnique.mockResolvedValue(null);
      prisma.accessRequest.findFirst.mockResolvedValue(null);

      await expect(service.authorizeMember('m1', 'u2')).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('createMessage', () => {
    it('persiste el mensaje y devuelve el DTO con el remitente', async () => {
      prisma.meeting.findUnique.mockResolvedValue({ id: 'm1', hostId: 'host' });
      prisma.meetingParticipant.findUnique.mockResolvedValue({ id: 'p1' });
      prisma.accessRequest.findFirst.mockResolvedValue(null);

      const sentAt = new Date('2026-09-22T14:30:00.000Z');
      prisma.chatMessage.create.mockResolvedValue({
        id: 'msg1',
        meetingId: 'm1',
        senderId: 'u1',
        message: 'Hola',
        sentAt,
        sender: { id: 'u1', fullName: 'Ana', avatarUrl: null },
      });

      const result = await service.createMessage('m1', 'u1', 'Hola');

      expect(prisma.chatMessage.create).toHaveBeenCalledWith({
        data: { meetingId: 'm1', senderId: 'u1', message: 'Hola' },
        include: {
          sender: { select: { id: true, fullName: true, avatarUrl: true } },
        },
      });
      expect(result).toEqual({
        id: 'msg1',
        meetingId: 'm1',
        sender: { id: 'u1', fullName: 'Ana', avatarUrl: null },
        message: 'Hola',
        sentAt,
      });
    });
  });

  describe('listMessages', () => {
    it('devuelve los mensajes en orden ascendente y filtra por before', async () => {
      prisma.meeting.findUnique.mockResolvedValue({ id: 'm1', hostId: 'host' });
      prisma.meetingParticipant.findUnique.mockResolvedValue({ id: 'p1' });
      prisma.accessRequest.findFirst.mockResolvedValue(null);

      const older = new Date('2026-09-22T14:00:00.000Z');
      const newer = new Date('2026-09-22T14:05:00.000Z');
      prisma.chatMessage.findMany.mockResolvedValue([
        {
          id: 'msg2',
          meetingId: 'm1',
          senderId: 'u1',
          message: 'Hola',
          sentAt: newer,
          sender: { id: 'u1', fullName: 'Ana', avatarUrl: null },
        },
        {
          id: 'msg1',
          meetingId: 'm1',
          senderId: 'u1',
          message: 'Primero',
          sentAt: older,
          sender: { id: 'u1', fullName: 'Ana', avatarUrl: null },
        },
      ]);

      const before = '2026-09-22T15:00:00.000Z';
      const result = await service.listMessages('m1', 'u1', {
        before,
        limit: 50,
      });

      expect(prisma.chatMessage.findMany).toHaveBeenCalledWith({
        where: { meetingId: 'm1', sentAt: { lt: new Date(before) } },
        include: {
          sender: { select: { id: true, fullName: true, avatarUrl: true } },
        },
        orderBy: { sentAt: 'desc' },
        take: 50,
      });
      expect(result.map((m) => m.id)).toEqual(['msg1', 'msg2']);
    });
  });

  describe('findUserPublic', () => {
    it('devuelve los datos públicos del usuario', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: 'u1',
        fullName: 'Ana',
        email: 'ana@mail.com',
        avatarUrl: null,
      });

      const result = await service.findUserPublic('u1');

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'u1' },
        select: { id: true, fullName: true, email: true, avatarUrl: true },
      });
      expect(result?.fullName).toBe('Ana');
    });
  });
});