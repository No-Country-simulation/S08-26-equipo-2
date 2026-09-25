import { io, type Socket } from "socket.io-client";

/**
 * Obtiene el token de autenticación actual desde localStorage
 */
export function getStoredAccessToken(): string | null {
  try {
    const raw = localStorage.getItem("meetflow-auth-session");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed.state?.accessToken || null;
  } catch {
    return null;
  }
}

/**
 * Resuelve la URL base y el path para la conexión de Socket.IO
 */
export function getChatSocketConfig() {
  const envWsUrl =
    import.meta.env.VITE_WS_URL || "";

  try {
    const parsed = new URL(envWsUrl);
    if (parsed.pathname.endsWith("/socket.io")) {
      const socketPath = parsed.pathname;
      return {
        url: parsed.origin,
        path: socketPath.startsWith("/") ? socketPath : `/${socketPath}`,
      };
    }
    return {
      url: parsed.origin,
      path: "/socket.io",
    };
  } catch {
    const cleaned = envWsUrl.replace(/\/socket\.io\/?$/, "");
    return {
      url: cleaned || "",
      path: "/socket.io",
    };
  }
}

/**
 * Instancia y configura el socket para el chat
 */
export function createChatSocket(token?: string | null): Socket {
  const authToken = token || getStoredAccessToken();
  const { url, path } = getChatSocketConfig();

  return io(url, {
    path,
    auth: {
      token: authToken,
    },
    transports: ["websocket", "polling"],
    autoConnect: false,
    reconnection: true,
    reconnectionAttempts: 8,
    reconnectionDelay: 1500,
  });
}
