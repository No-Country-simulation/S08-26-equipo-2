import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type AccessStatus = "INITIAL" | "PENDING" | "REJECTED" | "APPROVED";

export interface AccessRequestEntry {
  status: AccessStatus;
  requestedAt: number;
}

interface AccessRequestState {
  /**
   * Registro indexado por clave compuesta: `${userId}_${meetingId}`
   * para asegurar que diferentes usuarios en el mismo navegador no compartan estado.
   */
  requests: Record<string, AccessRequestEntry>;
  setStatus: (userId: string, meetingId: string, status: AccessStatus) => void;
  getStatus: (
    userId: string | undefined,
    meetingId: string | undefined
  ) => AccessStatus;
  getRequestInfo: (
    userId: string | undefined,
    meetingId: string | undefined
  ) => AccessRequestEntry | null;
  clearRequest: (userId: string, meetingId: string) => void;
}

const buildKey = (userId: string, meetingId: string) =>
  `${userId}_${meetingId}`;

export const useAccessRequestStore = create<AccessRequestState>()(
  persist(
    (set, get) => ({
      requests: {},

      setStatus: (userId, meetingId, status) => {
        if (!userId || !meetingId) return;
        const key = buildKey(userId, meetingId);
        set((state) => ({
          requests: {
            ...state.requests,
            [key]: {
              status,
              requestedAt: state.requests[key]?.requestedAt || Date.now(),
            },
          },
        }));
      },

      getStatus: (userId, meetingId) => {
        if (!userId || !meetingId) return "INITIAL";
        const key = buildKey(userId, meetingId);
        return get().requests[key]?.status || "INITIAL";
      },

      getRequestInfo: (userId, meetingId) => {
        if (!userId || !meetingId) return null;
        const key = buildKey(userId, meetingId);
        return get().requests[key] || null;
      },

      clearRequest: (userId, meetingId) => {
        if (!userId || !meetingId) return;
        const key = buildKey(userId, meetingId);
        set((state) => {
          const updated = { ...state.requests };
          delete updated[key];
          return { requests: updated };
        });
      },
    }),
    {
      name: "meetflow-access-requests",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
