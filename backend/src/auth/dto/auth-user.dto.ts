import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AuthUserDto {
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

  @ApiProperty({
    description: 'Fecha de creación de la cuenta',
    example: '2026-09-14T12:00:00.000Z',
  })
  createdAt: Date;
}