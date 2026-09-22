import api from "@/services/api/api";
import type {
  AccessRequestDto,
  AccessRequestWithUserDto,
} from "../types/accessRequest";

export const accessRequestService = {
  /**
   * Un participante solicita ingreso a la reunion.
   * POST /meetings/:meetingId/access-requests
   */
  async requestAccess(meetingId: string): Promise<AccessRequestDto> {
    const response = await api.post<AccessRequestDto>(
      `/meetings/${meetingId}/access-requests`
    );
    return response.data;
  },

  /**
   * El host consulta las solicitudes pendientes de la reunion.
   * GET /meetings/:meetingId/access-requests
   */
  async getPendingRequests(
    meetingId: string
  ): Promise<AccessRequestWithUserDto[]> {
    const response = await api.get<AccessRequestWithUserDto[]>(
      `/meetings/${meetingId}/access-requests`
    );
    return response.data;
  },

  /**
   * El host aprueba una solicitud de ingreso.
   * PATCH /meetings/:meetingId/access-requests/:id/approve
   */
  async approveRequest(
    meetingId: string,
    requestId: string
  ): Promise<AccessRequestDto> {
    const response = await api.patch<AccessRequestDto>(
      `/meetings/${meetingId}/access-requests/${requestId}/approve`
    );
    return response.data;
  },

  /**
   * El host rechaza una solicitud de ingreso.
   * PATCH /meetings/:meetingId/access-requests/:id/reject
   */
  async rejectRequest(
    meetingId: string,
    requestId: string
  ): Promise<AccessRequestDto> {
    const response = await api.patch<AccessRequestDto>(
      `/meetings/${meetingId}/access-requests/${requestId}/reject`
    );
    return response.data;
  },
};
