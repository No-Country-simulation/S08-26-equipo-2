import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MeetingUserDto } from '../../meetings/dto/meeting.dto.js';

export class AccessRequestDto {
  @ApiProperty({
    description: 'ID de la solicitud de ingreso (UUID)',
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  })
  id: string;

  @ApiProperty({
    description: 'ID de la reunión (UUID)',
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  })
  meetingId: string;

  @ApiProperty({
    description: 'ID del usuario solicitante (UUID)',
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  })
  userId: string;

  @ApiProperty({
    description: 'Estado de la solicitud',
    enum: ['PENDING', 'APPROVED', 'REJECTED'],
    example: 'PENDING',
  })
  status: string;

  @ApiPropertyOptional({
    description: 'ID del usuario que aprobó/rechazó la solicitud (UUID)',
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  })
  processedBy: string | null;

  @ApiProperty({
    description: 'Fecha y hora en que se realizó la solicitud (ISO 8601)',
    example: '2026-09-18T12:00:00.000Z',
  })
  requestedAt: Date;

  @ApiPropertyOptional({
    description: 'Fecha y hora en que se procesó la solicitud (ISO 8601)',
    example: '2026-09-18T12:05:00.000Z',
  })
  processedAt: Date | null;
}

export class AccessRequestWithUserDto extends AccessRequestDto {
  @ApiProperty({ description: 'Datos del usuario solicitante' })
  user: MeetingUserDto;
}