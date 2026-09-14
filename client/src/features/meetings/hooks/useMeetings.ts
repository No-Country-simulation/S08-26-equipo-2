import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { meetingsService, DEFAULT_MEETINGS } from "../services/meetings.service";
import type { Meeting } from "../types/meeting";

export const MEETINGS_QUERY_KEY = ["meetings"] as const;

/**
 * Hook para consultar reuniones usando TanStack Query
 */
export function useMeetings(initialData?: Meeting[]) {
  return useQuery({
    queryKey: MEETINGS_QUERY_KEY,
    queryFn: () => meetingsService.getMeetings(),
    initialData: initialData || DEFAULT_MEETINGS,
    staleTime: 1000 * 60 * 2, // 2 minutos
  });
}

/**
 * Hook para consultar una reunión por su ID
 */
export function useMeeting(id?: string) {
  return useQuery({
    queryKey: [...MEETINGS_QUERY_KEY, id],
    queryFn: () => (id ? meetingsService.getMeetingById(id) : undefined),
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 2,
  });
}

/**
 * Hook para crear una nueva reunión
 */
export function useCreateMeeting() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newMeeting: Partial<Meeting>) => meetingsService.createMeeting(newMeeting),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MEETINGS_QUERY_KEY });
    },
  });
}

/**
 * Hook para actualizar una reunión
 */
export function useUpdateMeeting() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Meeting> }) =>
      meetingsService.updateMeeting(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MEETINGS_QUERY_KEY });
    },
  });
}

/**
 * Hook para cancelar una reunión
 */
export function useCancelMeeting() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (meetingId: string) => meetingsService.cancelMeeting(meetingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MEETINGS_QUERY_KEY });
    },
  });
}
