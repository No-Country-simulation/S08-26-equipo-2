import api from "@/services/api/api";
import type {
  HistoryMeetingDto,
  HistoryMeetingUI,
} from "../types/history";

export function formatHistoryDate(isoString?: string | null): string {
  if (!isoString) return "Fecha no registrada";
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return "Fecha no registrada";
    return new Intl.DateTimeFormat("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(d);
  } catch {
    return "Fecha no registrada";
  }
}

export function formatHistoryTime(isoString?: string | null): string {
  if (!isoString) return "--:--";
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return "--:--";
    return new Intl.DateTimeFormat("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(d);
  } catch {
    return "--:--";
  }
}

export function calculateDuration(
  startIso?: string | null,
  endIso?: string | null,
  estimatedMinutes?: number | null
): string {
  if (startIso && endIso) {
    const start = new Date(startIso).getTime();
    const end = new Date(endIso).getTime();
    if (!isNaN(start) && !isNaN(end) && end > start) {
      const minutes = Math.round((end - start) / 60000);
      if (minutes < 60) return `${minutes} min`;
      const hours = Math.floor(minutes / 60);
      const remaining = minutes % 60;
      return remaining === 0 ? `${hours}h` : `${hours}h ${remaining}min`;
    }
  }

  if (estimatedMinutes && estimatedMinutes > 0) {
    if (estimatedMinutes < 60) return `${estimatedMinutes} min`;
    const hours = Math.floor(estimatedMinutes / 60);
    const remaining = estimatedMinutes % 60;
    return remaining === 0 ? `${hours}h` : `${hours}h ${remaining}min`;
  }

  return "Duración no registrada";
}

export function mapHistoryDtoToUI(dto: HistoryMeetingDto): HistoryMeetingUI {
  const referenceDate =
    dto.actualEndAt ||
    dto.actualStartAt ||
    dto.scheduledStartAt;

  const date = formatHistoryDate(referenceDate);
  const startTime = formatHistoryTime(dto.actualStartAt || dto.scheduledStartAt);
  const endTime = formatHistoryTime(dto.actualEndAt || dto.scheduledEndAt);
  const durationLabel = calculateDuration(
    dto.actualStartAt || dto.scheduledStartAt,
    dto.actualEndAt || dto.scheduledEndAt,
    dto.estimatedDurationMinutes
  );

  return {
    ...dto,
    date,
    startTime,
    endTime,
    durationLabel,
  };
}

export const historyService = {
  /**
   * Consulta el historial de reuniones finalizadas del usuario.
   * GET /meetings/history
   */
  async getHistory(): Promise<HistoryMeetingUI[]> {
    const response = await api.get<HistoryMeetingDto[]>("/meetings/history");
    return (response.data || []).map(mapHistoryDtoToUI);
  },
};
