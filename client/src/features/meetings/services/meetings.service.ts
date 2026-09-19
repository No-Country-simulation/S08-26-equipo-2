import api from "@/services/api/api";
import type {
  Meeting,
  MeetingDto,
  MeetingWithParticipantsDto,
  CreateMeetingPayload,
} from "../types/meeting";

export function formatMeetingDate(isoString?: string | null): string {
  if (!isoString) return "";
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return "";
    return new Intl.DateTimeFormat("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(d);
  } catch {
    return "";
  }
}

export function formatMeetingTime(isoString?: string | null): string {
  if (!isoString) return "";
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return "";
    return new Intl.DateTimeFormat("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(d);
  } catch {
    return "";
  }
}

export function formatMeetingDuration(minutes?: number | null): string {
  if (!minutes || minutes <= 0) return "60 min";
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  if (remaining === 0) return `${hours}h`;
  return `${hours}h ${remaining}min`;
}

export function mapMeetingDtoToMeeting(
  dto: MeetingDto | MeetingWithParticipantsDto
): Meeting {
  const date = formatMeetingDate(dto.scheduledStartAt || dto.actualStartAt);
  const time = formatMeetingTime(dto.scheduledStartAt || dto.actualStartAt);
  const duration = formatMeetingDuration(dto.estimatedDurationMinutes);
  const participants =
    "participants" in dto && Array.isArray(dto.participants)
      ? dto.participants
      : [];

  return {
    id: dto.id,
    code: dto.code,
    title: dto.title,
    name: dto.title,
    description: dto.description,
    status: dto.status,
    hostId: dto.hostId,
    scheduledStartAt: dto.scheduledStartAt,
    scheduledEndAt: dto.scheduledEndAt,
    actualStartAt: dto.actualStartAt,
    actualEndAt: dto.actualEndAt,
    estimatedDurationMinutes: dto.estimatedDurationMinutes,
    date,
    time,
    duration,
    roomUrl: `/meet/${dto.id}`,
    participants,
  };
}

export const meetingsService = {
  /**
   * Obtiene la agenda de reuniones programadas desde el backend (GET /meetings/agenda)
   */
  async getAgenda(): Promise<Meeting[]> {
    const response = await api.get<MeetingDto[]>("/meetings/agenda");
    if (Array.isArray(response.data)) {
      return response.data.map(mapMeetingDtoToMeeting);
    }
    return [];
  },

  /**
   * Obtiene el detalle de una reunión por su ID (GET /meetings/:id)
   */
  async getMeetingById(id: string): Promise<Meeting | undefined> {
    const response = await api.get<MeetingWithParticipantsDto>(`/meetings/${id}`);
    if (response.data) {
      return mapMeetingDtoToMeeting(response.data);
    }
    return undefined;
  },

  /**
   * Crea una nueva reunión programada (POST /meetings)
   */
  async createMeeting(payload: CreateMeetingPayload): Promise<Meeting> {
    const response = await api.post<MeetingDto>("/meetings", payload);
    return mapMeetingDtoToMeeting(response.data);
  },

  /**
   * Actualiza una reunión existente (PATCH /meetings/:id)
   */
  async updateMeeting(
    id: string,
    payload: Partial<CreateMeetingPayload>
  ): Promise<Meeting> {
    const response = await api.patch<MeetingDto>(`/meetings/${id}`, payload);
    return mapMeetingDtoToMeeting(response.data);
  },

  /**
   * Cierra/finaliza una reunión activa (PATCH /meetings/:id/close)
   */
  async closeMeeting(id: string): Promise<Meeting> {
    const response = await api.patch<MeetingDto>(`/meetings/${id}/close`);
    return mapMeetingDtoToMeeting(response.data);
  },
};
