export interface ChatSender {
  id: string;
  fullName: string;
  avatarUrl: string | null;
}

export interface ChatMessage {
  id: string;
  meetingId: string;
  sender: ChatSender;
  message: string;
  sentAt: string | Date;
}

export interface JoinRoomPayload {
  meetingId: string;
}

export interface SendMessagePayload {
  meetingId: string;
  message: string;
}

export interface ListMessagesQuery {
  before?: string;
  limit?: number;
}

export type ChatConnectionStatus = "disconnected" | "connecting" | "connected" | "error";
