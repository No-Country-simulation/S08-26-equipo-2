import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { accessRequestService } from "../services/accessRequest.service";
import type {
  AccessRequestDto,
  AccessRequestWithUserDto,
} from "../types/accessRequest";

/**
 * Consulta las solicitudes de ingreso pendientes para el anfitrion.
 * Intervalo espaciado de 15 segundos, pausado si la ventana no esta visible.
 */
export function usePendingAccessRequests(
  meetingId?: string,
  enabled: boolean = true
) {
  return useQuery<AccessRequestWithUserDto[], Error>({
    queryKey: ["access-requests", "pending", meetingId],
    queryFn: () => {
      if (!meetingId) return Promise.resolve([]);
      return accessRequestService.getPendingRequests(meetingId);
    },
    enabled: Boolean(meetingId) && enabled,
    refetchInterval: 15000,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: true,
  });
}

/**
 * Mutacion para que un participante solicite ingresar a la reunion.
 */
export function useRequestAccess() {
  const queryClient = useQueryClient();

  return useMutation<AccessRequestDto, Error, string>({
    mutationFn: (meetingId: string) =>
      accessRequestService.requestAccess(meetingId),
    onSuccess: (_data, meetingId) => {
      queryClient.invalidateQueries({
        queryKey: ["meetings", "detail", meetingId],
      });
    },
  });
}

/**
 * Mutacion para que el anfitrion apruebe una solicitud.
 */
export function useApproveAccessRequest() {
  const queryClient = useQueryClient();

  return useMutation<
    AccessRequestDto,
    Error,
    { meetingId: string; requestId: string }
  >({
    mutationFn: ({ meetingId, requestId }) =>
      accessRequestService.approveRequest(meetingId, requestId),
    onSuccess: (_data, { meetingId }) => {
      queryClient.invalidateQueries({
        queryKey: ["access-requests", "pending", meetingId],
      });
      queryClient.invalidateQueries({
        queryKey: ["meetings", "detail", meetingId],
      });
      queryClient.invalidateQueries({
        queryKey: ["meetings", meetingId],
      });
    },
  });
}

/**
 * Mutacion para que el anfitrion rechace una solicitud.
 */
export function useRejectAccessRequest() {
  const queryClient = useQueryClient();

  return useMutation<
    AccessRequestDto,
    Error,
    { meetingId: string; requestId: string }
  >({
    mutationFn: ({ meetingId, requestId }) =>
      accessRequestService.rejectRequest(meetingId, requestId),
    onSuccess: (_data, { meetingId }) => {
      queryClient.invalidateQueries({
        queryKey: ["access-requests", "pending", meetingId],
      });
    },
  });
}
