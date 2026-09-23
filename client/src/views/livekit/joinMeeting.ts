import axios from "axios";
import api from "@/services/api/api";

export interface MeetingConnection {
  token: string;
  serverUrl: string;
}

interface LivekitTokenResponse {
  token: string;
  url: string;
  room: string;
  identity: string;
}

/** Matches POST /api/livekit/token in the deployed backend. */
export async function joinMeeting(meetingId: string): Promise<MeetingConnection> {
  try {
    const { data } = await api.post<LivekitTokenResponse>("/livekit/token", { meetingId });
    const serverUrl = data?.url || import.meta.env.VITE_LIVEKIT_URL;
    if (typeof data?.token !== "string" || !data.token.trim() || !serverUrl) {
      throw new Error("No se recibió el acceso a la sala. Intenta nuevamente o contacta al organizador.");
    }
    const parsed = new URL(serverUrl);
    if (!["ws:", "wss:"].includes(parsed.protocol)) {
      throw new Error("La dirección de la sala no es válida. Contacta al organizador.");
    }
    return { token: data.token, serverUrl };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      if (status === 401) throw new Error("Tu sesión ha vencido. Inicia sesión nuevamente.", { cause: error });
      if (status === 403) throw new Error("Todavía no tienes permiso para entrar. Solicita acceso al anfitrión.", { cause: error });
      if (status === 404 || status === 501) throw new Error("No se pudo obtener el acceso a esta reunión. El servicio de ingreso podría no estar habilitado.", { cause: error });
      if (status === 409 || status === 410) throw new Error("La reunión no está disponible para ingresar en este momento.", { cause: error });
      throw new Error("No pudimos contactar con la sala. Revisa tu conexión e intenta nuevamente.", { cause: error });
    }
    throw error;
  }
}
