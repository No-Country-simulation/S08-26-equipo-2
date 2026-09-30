import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class MeetingUserDto {
  @ApiProperty({
    description: 'ID del usuario (UUID)',
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  })
  id: string;

  @ApiProperty({
    description: 'Nombre completo del usuario',
    example: 'Juan Pérez',
  })
  fullName: string;

  @ApiProperty({
    description: 'Correo electrónico del usuario',
    example: 'juan@correo.com',
  })
  email: string;

  @ApiPropertyOptional({
    description: 'URL del avatar',
    example: 'https://cdn.example.com/avatar.png',
  })
  avatarUrl: string | null;
}

export class MeetingParticipantDto {
  @ApiProperty({
    description: 'ID del participante (UUID)',
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  })
  id: string;

  @ApiProperty({
    description: 'Rol del participante en la reunión',
    enum: ['HOST', 'CO_HOST', 'PARTICIPANT'],
    example: 'PARTICIPANT',
  })
  role: string;

  @ApiProperty({
    description: 'Estado de conexión del participante',
    enum: ['WAITING_ROOM', 'CONNECTED', 'RECONNECTING', 'DISCONNECTED', 'LEFT'],
    example: 'CONNECTED',
  })
  connectionStatus: string;

  @ApiProperty({ description: 'Datos del usuario participante' })
  user: MeetingUserDto;
}

export class MeetingDto {
  @ApiProperty({
    description: 'ID de la reunión (UUID)',
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  })
  id: string;

  @ApiProperty({
    description: 'Código corto de acceso a la reunión',
    example: 'a1b2c3d4',
  })
  code: string;

  @ApiProperty({
    description: 'Título de la reunión',
    example: 'Sincronización semanal',
  })
  title: string;

  @ApiPropertyOptional({
    description: 'Descripción o detalle de la reunión',
    example: 'Repaso de avances y planificación de la semana',
  })
  description: string | null;

  @ApiProperty({
    description: 'ID del usuario anfitrión (UUID)',
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  })
  hostId: string;

  @ApiProperty({
    description: 'Estado de la reunión',
    enum: ['SCHEDULED', 'IN_PROGRESS', 'FINISHED', 'CANCELLED'],
    example: 'SCHEDULED',
  })
  status: string;

  @ApiPropertyOptional({
    description: 'Fecha y hora de inicio programada (ISO 8601)',
    example: '2026-10-01T14:00:00.000Z',
  })
  scheduledStartAt: Date | null;

  @ApiPropertyOptional({
    description: 'Fecha y hora de fin programada (ISO 8601)',
    example: '2026-10-01T15:00:00.000Z',
  })
  scheduledEndAt: Date | null;

  @ApiPropertyOptional({
    description: 'Fecha y hora de inicio real (ISO 8601)',
    example: '2026-10-01T14:02:00.000Z',
  })
  actualStartAt: Date | null;

  @ApiPropertyOptional({
    description: 'Fecha y hora de cierre real (ISO 8601)',
    example: '2026-10-01T15:05:00.000Z',
  })
  actualEndAt: Date | null;

  @ApiPropertyOptional({
    description: 'Duración estimada de la reunión en minutos',
    example: 60,
  })
  estimatedDurationMinutes: number | null;

  @ApiProperty({
    description: 'Tipo de acceso a la reunión',
    enum: ['PUBLIC_LINK', 'INVITE_ONLY'],
    example: 'PUBLIC_LINK',
  })
  accessType: string;

  @ApiProperty({
    description: 'Indica si el host debe aprobar el ingreso de participantes',
    example: true,
  })
  requiresHostApproval: boolean;

  @ApiProperty({
    description: 'Fecha de creación de la reunión',
    example: '2026-09-18T12:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Fecha de última actualización de la reunión',
    example: '2026-09-18T12:00:00.000Z',
  })
  updatedAt: Date;
}

export class MeetingWithParticipantsDto extends MeetingDto {
  @ApiProperty({
    description: 'Participantes de la reunión',
    type: () => [MeetingParticipantDto],
  })
  participants: MeetingParticipantDto[];
}