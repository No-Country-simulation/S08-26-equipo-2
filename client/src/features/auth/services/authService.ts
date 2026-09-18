import api from "@/services/api/api";
import type {
  AuthResponse,
  AuthUser,
  LoginCredentials,
  LogoutResponse,
  RegisterCredentials,
} from "../types";

export const authService = {
  /**
   * Inicia sesión con email y contraseña
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/auth/login", credentials);
    return response.data;
  },

  /**
   * Registra un nuevo usuario en el sistema
   */
  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/auth/register", credentials);
    return response.data;
  },

  /**
   * Renueva el access token mediante refresh token
   */
  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/auth/refresh", { refreshToken });
    return response.data;
  },

  /**
   * Cierra sesión invalidando el refresh token en el servidor
   */
  async logout(): Promise<LogoutResponse> {
    const response = await api.post<LogoutResponse>("/auth/logout");
    return response.data;
  },

  /**
   * Obtiene la información del usuario autenticado
   */
  async getMe(): Promise<{ user: AuthUser }> {
    const response = await api.get<{ user: AuthUser }>("/auth/me");
    return response.data;
  },
};
