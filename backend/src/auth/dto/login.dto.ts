import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MaxLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'Correo electrónico del usuario',
    example: 'juan@correo.com',
  })
  @IsEmail()
  @MaxLength(150)
  email: string;

  @ApiProperty({
    description: 'Contraseña del usuario',
    maxLength: 255,
    writeOnly: true,
  })
  @IsNotEmpty()
  @MaxLength(255)
  password: string;
}