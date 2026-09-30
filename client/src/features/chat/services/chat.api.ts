import api from "@/services/api/api";
import type { ChatMessage, ListMessagesQuery } from "../types/chat.types";

export const chatApi = {
  /**
   * Obtiene el historial de mensajes de una reunión (GET /meetings/:id/messages)
   */
  async getMeetingMessages(
    meetingId: string,
    query?: ListMessagesQuery
  ): Promise<ChatMessage[]> {
    const params = new URLSearchParams();
    if (query?.before) params.append("before", query.before);
    if (query?.limit) params.append("limit", String(query.limit));

    const response = await api.get<ChatMessage[]>(
      `/meetings/${meetingId}/messages`,
      { params }
    );
    return Array.isArray(response.data) ? response.data : [];
  },
};

export default chatApi;
