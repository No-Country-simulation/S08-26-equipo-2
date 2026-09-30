import { useMemo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { chatApi } from "../services/chat.api";
import type { ChatMessage } from "../types/chat.types";

export const CHAT_HISTORY_QUERY_KEY = ["meetings", "chat-history"] as const;

export interface UseMeetingChatHistoryOptions {
  limit?: number;
  enabled?: boolean;
}

export function useMeetingChatHistory(
  meetingId?: string,
  options: UseMeetingChatHistoryOptions = {}
) {
  const limit = options.limit ?? 30;
  const enabled = options.enabled !== false && Boolean(meetingId);

  const query = useInfiniteQuery({
    queryKey: [...CHAT_HISTORY_QUERY_KEY, meetingId],
    queryFn: async ({ pageParam }) => {
      if (!meetingId) return [];
      return chatApi.getMeetingMessages(meetingId, {
        before: pageParam,
        limit,
      });
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage: ChatMessage[]) => {
      // Si la página devolvió menos elementos que el límite, ya no hay mensajes anteriores
      if (!lastPage || lastPage.length < limit) {
        return undefined;
      }
      // El backend devuelve los mensajes ordenados cronológicamente (antiguos a recientes).
      // El mensaje más antiguo de esta tanda es el primero (lastPage[0]).
      const oldestMessage = lastPage[0];
      if (!oldestMessage?.sentAt) return undefined;
      return new Date(oldestMessage.sentAt).toISOString();
    },
    enabled,
    staleTime: 1000 * 60 * 5, // 5 minutos de cache
  });

  // Aplanar todas las páginas manteniendo el orden cronológico continuo:
  // Cada página subsecuente contiene mensajes más antiguos que la anterior,
  // por lo que invertimos el orden de las páginas antes de aplanar.
  const allMessages = useMemo(() => {
    if (!query.data?.pages) return [];
    const reversedPages = [...query.data.pages].reverse();
    return reversedPages.flat();
  }, [query.data?.pages]);

  return {
    ...query,
    messages: allMessages,
  };
}

export default useMeetingChatHistory;
