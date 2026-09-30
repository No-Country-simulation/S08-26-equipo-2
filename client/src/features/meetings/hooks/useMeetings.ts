import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { meetingsService } from "../services/meetings.service";
import type { Meeting, CreateMeetingPayload } from "../types/meeting";

export const MEETINGS_QUERY_KEY = ["meetings"] as const;
export const AGENDA_QUERY_KEY = ["meetings", "agenda"] as const;

/**
 * Hook para consultar la agenda de reuniones programadas desde el backend
 */
export function useMeetings(initialData?: Meeting[]) {
  return useQuery({
    queryKey: AGENDA_QUERY_KEY,
    queryFn: () => meetingsService.getAgenda(),
    initialData,
    staleTime: 1000 * 60 * 2, // 2 minutos
  });
}

/**
 * Alias semántico para la agenda de reuniones programadas
 */
export const useAgendaMeetings = useMeetings;

/**
 * Hook para consultar una reunión por su ID
 */
export function useMeeting(id?: string) {
  return useQuery({
    queryKey: [...MEETINGS_QUERY_KEY, "detail", id],
    queryFn: () => (id ? meetingsService.getMeetingById(id) : undefined),
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 2,
  });
}

/**
 * Hook para crear una nueva reunión programada
 */
export function useCreateMeeting() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateMeetingPayload) =>
      meetingsService.createMeeting(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AGENDA_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: MEETINGS_QUERY_KEY });
    },
  });
}

/**
 * Hook para cerrar/finalizar una reunión activa
 */
export function useCloseMeeting() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (meetingId: string) => meetingsService.closeMeeting(meetingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AGENDA_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: MEETINGS_QUERY_KEY });
    },
  });
}

/**
 * Hook para actualizar una reunión existente (PATCH /meetings/:id)
 */
export function useUpdateMeeting() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<CreateMeetingPayload>;
    }) => meetingsService.updateMeeting(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: AGENDA_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: MEETINGS_QUERY_KEY });
      queryClient.invalidateQueries({
        queryKey: [...MEETINGS_QUERY_KEY, "detail", variables.id],
      });
    },
  });
}

/**
 * Compatibilidad con componentes que invoquen cancelación/cierre
 */
export const useCancelMeeting = useCloseMeeting;
