import { ApiProperty } from '@nestjs/swagger';

export class ChatSenderDto {
  @ApiProperty({ description: 'Id del usuario que envió el mensaje' })
  id: string;

  @ApiProperty({ description: 'Nombre completo del usuario' })
  fullName: string;

  @ApiProperty({
    description: 'Avatar del usuario',
    nullable: true,
    type: String,
  })
  avatarUrl: string | null;
}

export class ChatMessageResponseDto {
  @ApiProperty({ description: 'Id del mensaje' })
  id: string;

  @ApiProperty({ description: 'Id de la reunión' })
  meetingId: string;

  @ApiProperty({ description: 'Remitente del mensaje', type: ChatSenderDto })
  sender: ChatSenderDto;

  @ApiProperty({ description: 'Contenido del mensaje' })
  message: string;

  @ApiProperty({ description: 'Fecha de envío del mensaje' })
  sentAt: Date;
}