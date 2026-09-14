import { Body, Controller, Get, HttpCode, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service.js';
import { CurrentUser, type AuthUser } from './current-user.decorator.js';
import {
  AuthResponseDto,
  AuthUserResponseDto,
  LogoutResponseDto,
} from './dto/auth-response.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { RefreshDto } from './dto/refresh.dto.js';
import { RegisterDto } from './dto/register.dto.js';
import { JwtAuthGuard } from './jwt-auth.guard.js';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Registrar un nuevo usuario' })
  @ApiCreatedResponse({
    description: 'Usuario creado. Devuelve los tokens y los datos del usuario.',
    type: AuthResponseDto,
  })
  @ApiConflictResponse({ description: 'El email ya está registrado' })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @HttpCode(200)
  @Post('login')
  @ApiOperation({ summary: 'Iniciar sesión' })
  @ApiOkResponse({
    description: 'Credenciales válidas. Devuelve los tokens y los datos del usuario.',
    type: AuthResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Credenciales inválidas' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @HttpCode(200)
  @Post('refresh')
  @ApiOperation({ summary: 'Renovar el access token con un refresh token' })
  @ApiOkResponse({
    description: 'Tokens renovados (rotación del refresh token).',
    type: AuthResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Refresh token inválido, expirado o sesión cerrada',
  })
  refresh(@Body() dto: RefreshDto) {
    return this.authService.refresh(dto);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cerrar sesión (invalida el refresh token)' })
  @ApiOkResponse({ description: 'Sesión cerrada correctamente', type: LogoutResponseDto })
  @ApiUnauthorizedResponse({ description: 'Access token inválido o ausente' })
  logout(@CurrentUser() user: AuthUser) {
    return this.authService.logout(user.id);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener el usuario autenticado' })
  @ApiOkResponse({ description: 'Datos del usuario actual', type: AuthUserResponseDto })
  @ApiUnauthorizedResponse({ description: 'Access token inválido o ausente' })
  me(@CurrentUser() user: AuthUser) {
    return { user };
  }
}