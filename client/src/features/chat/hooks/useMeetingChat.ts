import { useState, useEffect, useRef, useCallback } from "react";
import type { Socket } from "socket.io-client";
import type {
  ChatMessage,
  ChatConnectionStatus,
} from "../types/chat.types";
import { chatApi } from "../services/chat.api";
import { createChatSocket } from "../services/chat.socket";

export interface UseMeetingChatOptions {
  autoConnect?: boolean;
}

export function useMeetingChat(
  meetingId?: string,
  options: UseMeetingChatOptions = { autoConnect: true }
) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [status, setStatus] = useState<ChatConnectionStatus>("disconnected");
  const [error, setError] = useState<string | null>(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const socketRef = useRef<Socket | null>(null);

  // 1. Cargar historial de mensajes mediante API REST
  const loadHistory = useCallback(async () => {
    if (!meetingId) return;
    try {
      setIsLoadingHistory(true);
      setError(null);
      const history = await chatApi.getMeetingMessages(meetingId);
      setMessages(history);
    } catch (err: any) {
      const errMsg =
        err.response?.data?.message ||
        "No se pudo cargar el historial de mensajes.";
      setError(errMsg);
    } finally {
      setIsLoadingHistory(false);
    }
  }, [meetingId]);

  // 2. Conexión WebSocket y gestión de eventos en tiempo real
  useEffect(() => {
    if (!meetingId || options.autoConnect === false) {
      return;
    }

    loadHistory();

    const socket = createChatSocket();
    socketRef.current = socket;
    setStatus("connecting");

    socket.on("connect", () => {
      setStatus("connected");
      setError(null);
      // Unirse a la sala de la reunión
      socket.emit("join_room", { meetingId });
    });

    socket.on("chat:joined", () => {
      // Confirmación de ingreso a la sala de chat
    });

    socket.on("chat:message", (newMsg: ChatMessage) => {
      setMessages((prev) => {
        // Evitar duplicados por id
        if (prev.some((m) => m.id === newMsg.id)) {
          return prev;
        }
        return [...prev, newMsg];
      });
    });

    socket.on("chat:error", (errData: { message?: string }) => {
      setError(errData.message || "Error en el chat.");
    });

    socket.on("connect_error", (err: Error) => {
      setStatus("error");
      setError(err.message || "Error de conexión con el servidor de chat.");
    });

    socket.on("disconnect", () => {
      setStatus("disconnected");
    });

    socket.connect();

    return () => {
      socket.disconnect();
      socketRef.current = null;
      setStatus("disconnected");
    };
  }, [meetingId, options.autoConnect, loadHistory]);

  // 3. Envío de mensaje
  const sendMessage = useCallback(
    async (text: string): Promise<boolean> => {
      const trimmed = text.trim();
      if (!trimmed || !meetingId || !socketRef.current) {
        return false;
      }

      setIsSending(true);
      try {
        socketRef.current.emit("send_message", {
          meetingId,
          message: trimmed,
        });
        return true;
      } catch (err: any) {
        setError(err.message || "No se pudo enviar el mensaje.");
        return false;
      } finally {
        setIsSending(false);
      }
    },
    [meetingId]
  );

  return {
    messages,
    status,
    isConnected: status === "connected",
    isLoadingHistory,
    isSending,
    error,
    sendMessage,
    refetchHistory: loadHistory,
  };
}

export default useMeetingChat;
