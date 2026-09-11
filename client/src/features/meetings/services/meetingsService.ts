import api from "@/services/api/api";
import type { Meeting } from "../types/meeting";

export const DEFAULT_MEETINGS: Meeting[] = [
  { id: '1', name: 'Revisión de Sprint Q4', date: '7 sep 2026', time: '10:00', duration: '45 min', participants: 6, status: 'live' },
  { id: '2', name: 'Planificación de Producto', date: '7 sep 2026', time: '09:00', duration: '1h 20min', participants: 8, status: 'completed' },
  { id: '3', name: 'Demo con Cliente Acme', date: '6 sep 2026', time: '14:30', duration: '52 min', participants: 4, status: 'completed' },
  { id: '4', name: 'Entrevista Técnica — Carlos M.', date: '5 sep 2026', time: '15:30', duration: '52 min', participants: 3, status: 'completed' },
  { id: '5', name: 'Kick-off Proyecto Beta', date: '5 sep 2026', time: '11:00', duration: '1h 45min', participants: 15, status: 'completed' },
  { id: '6', name: 'Sincronización de Equipo', date: '4 sep 2026', time: '09:00', duration: '30 min', participants: 12, status: 'completed' },
  { id: '7', name: 'Revisión de Diseño UI', date: '3 sep 2026', time: '16:00', duration: '1h', participants: 5, status: 'cancelled' },
  { id: '8', name: 'Sprint Planning', date: '1 sep 2026', time: '10:00', duration: '2h', participants: 9, status: 'completed' },
];

export const meetingsService = {
  /**
   * Obtiene la lista de reuniones desde la API, con fallback a datos locales si la API no está disponible
   */
  async getMeetings(): Promise<Meeting[]> {
    try {
      const response = await api.get<Meeting[]>("/meetings");
      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        return response.data;
      }
      return DEFAULT_MEETINGS;
    } catch {
      // Fallback para desarrollo offline / endpoints en desarrollo
      return DEFAULT_MEETINGS;
    }
  },

  /**
   * Obtiene el detalle de una reunión por su ID
   */
  async getMeetingById(id: string): Promise<Meeting | undefined> {
    try {
      const response = await api.get<Meeting>(`/meetings/${id}`);
      return response.data;
    } catch {
      return DEFAULT_MEETINGS.find((m) => m.id === id);
    }
  },

  /**
   * Crea una nueva reunión
   */
  async createMeeting(data: Partial<Meeting>): Promise<Meeting> {
    try {
      const response = await api.post<Meeting>("/meetings", data);
      return response.data;
    } catch {
      // Fallback para desarrollo offline / backend en progreso
      const slug = (data.name || "reunion")
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-")
        .replace(/-+/g, "-")
        .slice(0, 20);
      const generatedLink = `meetflow.app/meet/${slug}-${Math.random().toString(36).substring(2, 7)}`;
      
      const newMeeting: Meeting = {
        id: String(Date.now()),
        name: data.name || "Nueva Reunión",
        date: data.date || "10 sep 2026",
        time: data.time || "10:00",
        duration: data.duration ? `${data.duration} min` : "60 min",
        participants: data.participants ?? 1,
        status: "upcoming",
        roomUrl: generatedLink,
        description: data.description || "",
      };
      DEFAULT_MEETINGS.unshift(newMeeting);
      return newMeeting;
    }
  },

  /**
   * Cancela una reunión por ID
   */
  async cancelMeeting(id: string): Promise<void> {
    await api.delete(`/meetings/${id}`);
  },
};
