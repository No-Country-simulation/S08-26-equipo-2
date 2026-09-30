import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    description: 'Nombre completo del usuario',
    example: 'Juan Pérez',
  })
  @IsNotEmpty()
  @MaxLength(120)
  fullName: string;

  @ApiProperty({
    description: 'Correo electrónico del usuario',
    example: 'juan@correo.com',
  })
  @IsEmail()
  @MaxLength(150)
  email: string;

  @ApiProperty({
    description: 'Contraseña (mínimo 8 caracteres)',
    minLength: 8,
    maxLength: 255,
    writeOnly: true,
  })
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(255)
  password: string;
}