import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import type { Socket } from 'socket.io';
import { ChatService } from './chat.service.js';

export interface ChatUser {
  id: string;
  fullName: string;
  email: string;
  avatarUrl: string | null;
}

export interface AuthenticatedSocket extends Socket {
  data: {
    user: ChatUser;
  };
}

export function extractTokenFromSocket(client: Socket): string | undefined {
  const { auth, headers, query } = client.handshake;

  const socketAuth = auth as { token?: string } | undefined;
  if (socketAuth?.token) {
    return socketAuth.token;
  }

  const tokenFromQuery = query?.token;
  if (typeof tokenFromQuery === 'string' && tokenFromQuery) {
    return tokenFromQuery;
  }

  const bearer = headers?.authorization;
  if (bearer?.startsWith('Bearer ')) {
    return bearer.slice(7);
  }

  return undefined;
}

@Injectable()
export class WsJwtAuthGuard implements CanActivate {
  private readonly logger = new Logger(WsJwtAuthGuard.name);

  constructor(
    private readonly config: ConfigService,
    private readonly jwtService: JwtService,
    private readonly chatService: ChatService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient<AuthenticatedSocket>();
    if (client.data.user) {
      return true;
    }

    try {
      const token = extractTokenFromSocket(client);
      if (!token) {
        throw new WsException('No autorizado');
      }

      const payload = await this.jwtService.verifyAsync<{
        sub: string;
        type: string;
      }>(token, {
        secret: this.config.get<string>('JWT_SECRET') ?? 'change-me',
      });
      if (payload.type !== 'access') {
        throw new WsException('No autorizado');
      }

      const user = await this.chatService.findUserPublic(payload.sub);
      if (!user) {
        throw new WsException('Usuario no encontrado');
      }

      client.data.user = user;
      return true;
    } catch (err) {
      this.logger.warn(
        `Evento rechazado: ${err instanceof Error ? err.message : 'No autorizado'}`,
      );
      throw err instanceof WsException
        ? err
        : new WsException('No autorizado');
    }
  }
}