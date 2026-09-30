import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class JoinRoomChatDto {
  @ApiProperty({
    description: 'Id de la reunión cuyo chat se desea escuchar',
    example: '3f2d0d40-1a2b-4c3d-9e4f-5a6b7c8d9e0f',
  })
  @IsNotEmpty({ message: 'El id de la reunión es obligatorio' })
  @IsUUID()
  meetingId: string;
}