import { ApiProperty } from '@nestjs/swagger';
import { MeetingDto } from './meeting.dto.js';

export class MeetingLinkDto {
  @ApiProperty({
    description: 'ID de la reunión (UUID)',
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  })
  meetingId: string;

  @ApiProperty({
    description: 'Código corto de acceso a la reunión',
    example: 'a1b2c3d4',
  })
  code: string;

  @ApiProperty({
    description: 'Enlace de invitación para compartir con los participantes',
    example: 'https://app.s08-26.com/join/a1b2c3d4',
  })
  link: string;
}

export class MeetingWithLinkDto extends MeetingDto {
  @ApiProperty({
    description: 'Enlace de invitación para compartir con los participantes',
    example: 'https://app.s08-26.com/join/a1b2c3d4',
  })
  link: string;
}