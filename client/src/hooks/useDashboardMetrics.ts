import { useMemo } from "react";
import { useMeetings, useMeeting } from "@/features/meetings/hooks/useMeetings";
import { useHistoryMeetings } from "@/features/history/hooks/useHistory";
import { getTodayDateString } from "@/features/meetings/hooks/useFormMeetings";
import type { Meeting } from "@/features/meetings/types/meeting";
import type { HistoryMeetingUI } from "@/features/history/types/history";

export interface DashboardMetric {
  label: string;
  value: string;
  sub: string;
  color: string;
}

export function useDashboardMetrics() {
  const { data: agendaMeetings = [], isLoading: isLoadingAgenda, refetch: refetchAgenda } = useMeetings();
  const { rawMeetings = [], isLoading: isLoadingHistory, refetch: refetchHistory } = useHistoryMeetings();

  const todayStr = getTodayDateString();

  // 1. Filtrar reuniones de hoy
  const todayMeetings = useMemo(() => {
    return agendaMeetings.filter((m) => {
      if (m.date === todayStr) return true;
      if (m.scheduledStartAt) {
        const startLocal = new Date(m.scheduledStartAt);
        const y = startLocal.getFullYear();
        const mon = String(startLocal.getMonth() + 1).padStart(2, "0");
        const d = String(startLocal.getDate()).padStart(2, "0");
        return `${y}-${mon}-${d}` === todayStr;
      }
      return false;
    });
  }, [agendaMeetings, todayStr]);

  // 2. Candidata a reunión destacada (prioridad: En vivo, luego la próxima de hoy, luego la próxima general)
  const candidateFeaturedMeeting = useMemo<Meeting | null>(() => {
    const liveMeeting = agendaMeetings.find(
      (m) => m.status === "IN_PROGRESS" || m.status === "live"
    );
    if (liveMeeting) return liveMeeting;

    if (todayMeetings.length > 0) {
      return todayMeetings[0];
    }

    if (agendaMeetings.length > 0) {
      return agendaMeetings[0];
    }

    return null;
  }, [agendaMeetings, todayMeetings]);

  // Consulta el detalle completo con la lista real de participantes (GET /meetings/:id)
  const { data: fullFeaturedMeeting, isLoading: isLoadingFeaturedDetail } = useMeeting(
    candidateFeaturedMeeting?.id
  );

  const featuredMeeting = fullFeaturedMeeting || candidateFeaturedMeeting;

  const isLoading = isLoadingAgenda || isLoadingHistory;

  // 3. Últimas 3 reuniones finalizadas
  const recentHistory = useMemo<HistoryMeetingUI[]>(() => {
    return rawMeetings.slice(0, 3);
  }, [rawMeetings]);

  // 4. Cálculo de las 4 estadísticas
  const stats = useMemo<DashboardMetric[]>(() => {
    // A. Reuniones realizadas
    const completedCount = rawMeetings.length;
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const completedThisMonth = rawMeetings.filter((m) => {
      const dateStr = m.actualEndAt || m.actualStartAt || m.scheduledStartAt;
      if (!dateStr) return false;
      const d = new Date(dateStr);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    }).length;

    const completedSub =
      completedThisMonth > 0
        ? `${completedThisMonth} este mes`
        : "Total concluidas";

    // B. Próximas reuniones
    const upcomingCount = agendaMeetings.filter(
      (m) => m.status === "SCHEDULED" || m.status === "upcoming"
    ).length;

    const upcomingSub =
      todayMeetings.length > 0
        ? `${todayMeetings.length} programadas hoy`
        : "En agenda";

    // C. Duración total acumulada
    const totalMinutes = rawMeetings.reduce((acc, m) => {
      if (m.actualStartAt && m.actualEndAt) {
        const start = new Date(m.actualStartAt).getTime();
        const end = new Date(m.actualEndAt).getTime();
        if (!isNaN(start) && !isNaN(end) && end > start) {
          return acc + Math.round((end - start) / 60000);
        }
      }
      if (m.estimatedDurationMinutes && m.estimatedDurationMinutes > 0) {
        return acc + m.estimatedDurationMinutes;
      }
      return acc + 60;
    }, 0);

    const totalHours = Math.round(totalMinutes / 60);
    const durationDisplay =
      totalHours > 0
        ? `${totalHours}h`
        : totalMinutes > 0
        ? `${totalMinutes}m`
        : "0h";

    // D. Participantes únicos
    const participantsSet = new Set<string>();
    let totalCount = 0;

    for (const m of rawMeetings) {
      if (Array.isArray(m.participants)) {
        totalCount += m.participants.length;
        for (const p of m.participants) {
          const id = typeof p === "string" ? p : p.id || (p as any).userId || (p as any).user?.id || (p as any).user?.email;
          if (id) participantsSet.add(id);
        }
      }
    }

    for (const m of agendaMeetings) {
      if (Array.isArray(m.participants)) {
        totalCount += m.participants.length;
        for (const p of m.participants) {
          const id = typeof p === "string" ? p : p.id || (p as any).user?.id || (p as any).user?.email;
          if (id) participantsSet.add(id);
        }
      }
    }

    if (featuredMeeting?.participants && Array.isArray(featuredMeeting.participants)) {
      totalCount += featuredMeeting.participants.length;
      for (const p of featuredMeeting.participants) {
        const id = typeof p === "string" ? p : p.id || (p as any).user?.id || (p as any).user?.email;
        if (id) participantsSet.add(id);
      }
    }

    const uniqueParticipantsCount =
      participantsSet.size > 0 ? participantsSet.size : totalCount;

    return [
      {
        label: "Reuniones realizadas",
        value: String(completedCount),
        sub: completedSub,
        color: "#3b82f6",
      },
      {
        label: "Próximas reuniones",
        value: String(upcomingCount),
        sub: upcomingSub,
        color: "#8b5cf6",
      },
      {
        label: "Duración total",
        value: durationDisplay,
        sub: "En sesiones concluidas",
        color: "#22c55e",
      },
      {
        label: "Participantes únicos",
        value: String(uniqueParticipantsCount),
        sub: "En tus sesiones",
        color: "#f59e0b",
      },
    ];
  }, [rawMeetings, agendaMeetings, todayMeetings, featuredMeeting]);

  const refetchAll = () => {
    refetchAgenda();
    refetchHistory();
  };

  return {
    stats,
    todayMeetings,
    featuredMeeting,
    recentHistory,
    agendaMeetings,
    isLoading: isLoading || isLoadingFeaturedDetail,
    isLoadingFeaturedDetail,
    refetchAll,
  };
}

export default useDashboardMetrics;
