import { ApiProperty } from '@nestjs/swagger';

export class LivekitTokenResponseDto {
  @ApiProperty({
    description: 'Token JWT de acceso a la sala de LiveKit',
  })
  token: string;

  @ApiProperty({
    description: 'URL del servidor de LiveKit (wss://...)',
    example: 'wss://meetflow.livekit.cloud',
  })
  url: string;

  @ApiProperty({
    description: 'Nombre de la sala de LiveKit',
    example: 'meeting_abc12345',
  })
  room: string;

  @ApiProperty({
    description: 'Identidad del usuario dentro de la sala',
  })
  identity: string;
}