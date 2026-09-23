import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, MaxLength } from 'class-validator';

export class SendMessageDto {
  @ApiProperty({
    description: 'Id de la reunión de destino',
    example: '3f2d0d40-1a2b-4c3d-9e4f-5a6b7c8d9e0f',
  })
  @IsNotEmpty({ message: 'El id de la reunión es obligatorio' })
  @IsUUID()
  meetingId: string;

  @ApiProperty({
    description: 'Contenido del mensaje',
    example: 'Hola a todos',
  })
  @IsString()
  @IsNotEmpty({ message: 'El mensaje no puede estar vacío' })
  @MaxLength(2000, {
    message: 'El mensaje no puede superar los 2000 caracteres',
  })
  message: string;
}