import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { authService } from "../services/authService";
import type {
  AuthResponse,
  AuthUser,
  LoginCredentials,
  RegisterCredentials,
} from "../types";
import axios from "axios";
import { queryClient } from "@/lib/queryClient";

export interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  register: (credentials: RegisterCredentials) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
  setSession: (response: AuthResponse) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      clearError: () => set({ error: null }),

      setSession: (response: AuthResponse) => {
        set({
          user: response.user,
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
          isAuthenticated: true,
          error: null,
        });
      },

      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.login(credentials);
          set({
            user: response.user,
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          return response;
        } catch (err: unknown) {
          let message = "Error al iniciar sesión. Verifica tus credenciales.";
          if (axios.isAxiosError(err) && err.response?.data) {
            const data = err.response.data as { message?: string | string[] };
            if (Array.isArray(data.message)) {
              message = data.message.join(", ");
            } else if (typeof data.message === "string") {
              message = data.message;
            }
          }
          set({ error: message, isLoading: false });
          throw new Error(message);
        }
      },

      register: async (credentials: RegisterCredentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.register(credentials);
          set({
            user: response.user,
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          return response;
        } catch (err: unknown) {
          let message = "Error al registrar la cuenta.";
          if (axios.isAxiosError(err) && err.response?.data) {
            const data = err.response.data as { message?: string | string[] };
            if (Array.isArray(data.message)) {
              message = data.message.join(", ");
            } else if (typeof data.message === "string") {
              message = data.message;
            }
          }
          set({ error: message, isLoading: false });
          throw new Error(message);
        }
      },

      logout: async () => {
        const { accessToken } = get();
        try {
          if (accessToken) {
            await authService.logout();
          }
        } catch (err) {
          console.warn("Error calling logout endpoint:", err);
        } finally {
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
          localStorage.removeItem("meetflow-auth-session");
          queryClient.clear();
        }
      },

      checkAuth: async () => {
        const { accessToken } = get();
        if (!accessToken) {
          set({ isAuthenticated: false, user: null });
          return;
        }

        try {
          const { user } = await authService.getMe();
          set({ user, isAuthenticated: true });
        } catch {
          // If token verification fails, logout
          await get().logout();
        }
      },
    }),
    {
      name: "meetflow-auth-session",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
