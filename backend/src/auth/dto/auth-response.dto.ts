import { ApiProperty } from '@nestjs/swagger';
import type { AuthUser } from '../auth.service.js';
import { AuthUserDto } from './auth-user.dto.js';

export class AuthResponseDto {
  @ApiProperty({
    description: 'Access token JWT (Bearer) para autenticar las peticiones',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string;

  @ApiProperty({
    description: 'Refresh token JWT para renovar el access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  refreshToken: string;

  @ApiProperty({
    description: 'Datos del usuario autenticado',
    type: () => AuthUserDto,
  })
  user: AuthUser;
}

export class AuthUserResponseDto {
  @ApiProperty({ type: () => AuthUserDto })
  user: AuthUser;
}

export class LogoutResponseDto {
  @ApiProperty({ description: 'Indica si la sesión se cerró correctamente', example: true })
  success: boolean;
}