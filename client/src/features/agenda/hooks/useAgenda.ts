import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useMeetings } from '@/features/meetings/hooks/useMeetings';
import { historyService } from '@/features/history/services/history.service';
import type { Meeting } from '@/features/meetings/types/meeting';
import type { CalendarViewMode, CalendarEventStatus, CalendarDayCell } from '../types/agenda.types';

export type { CalendarEventStatus };

export const DAYS_NAMES = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'] as const;
export const MONTHS_NAMES = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
] as const;

export const STATUS_COLORS: Record<CalendarEventStatus, { color: string; bg: string; border: string }> = {
  live: { color: '#22c55e', bg: 'rgba(34, 197, 94, 0.12)', border: 'rgba(34, 197, 94, 0.3)' },
  upcoming: { color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.12)', border: 'rgba(59, 130, 246, 0.3)' },
  completed: { color: '#64748b', bg: 'rgba(100, 116, 139, 0.12)', border: 'rgba(100, 116, 139, 0.3)' },
  cancelled: { color: '#ef4444', bg: 'rgba(239, 68, 68, 0.12)', border: 'rgba(239, 68, 68, 0.3)' },
};

export function normalizeMeetingStatus(status?: string): CalendarEventStatus {
  if (!status) return 'upcoming';
  const s = status.toUpperCase();
  if (s === 'IN_PROGRESS' || s === 'LIVE') return 'live';
  if (s === 'FINISHED' || s === 'COMPLETED') return 'completed';
  if (s === 'CANCELLED' || s === 'CANCELED') return 'cancelled';
  return 'upcoming';
}

export function formatDateToKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function isSameDay(d1: Date, d2: Date): boolean {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

export function useAgenda() {
  const {
    data: agendaMeetings = [],
    isLoading: isLoadingAgenda,
    isError: isErrorAgenda,
    refetch: refetchAgenda,
  } = useMeetings();

  const {
    data: historyMeetings = [],
    isLoading: isLoadingHistory,
    isError: isErrorHistory,
    refetch: refetchHistory,
  } = useQuery({
    queryKey: ['meetings', 'history'],
    queryFn: () => historyService.getHistory(),
    staleTime: 1000 * 60 * 2,
  });

  const [viewMode, setViewMode] = useState<CalendarViewMode>('month');
  const [currentDate, setCurrentDate] = useState<Date>(() => new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date());

  const today = useMemo(() => new Date(), []);

  // Combinar reuniones de la agenda programada y del historial sin duplicados
  const allMeetings = useMemo<Meeting[]>(() => {
    const list: Meeting[] = [...agendaMeetings];
    const existingIds = new Set(agendaMeetings.map((m) => m.id).filter(Boolean));

    for (const h of historyMeetings) {
      if (h.id && existingIds.has(h.id)) continue;
      list.push({
        id: h.id,
        code: h.code,
        title: h.title,
        name: h.title,
        description: h.description,
        status: h.status === 'FINISHED' ? 'completed' : (h.status as any),
        hostId: h.hostId,
        scheduledStartAt: h.scheduledStartAt,
        scheduledEndAt: h.scheduledEndAt,
        actualStartAt: h.actualStartAt,
        actualEndAt: h.actualEndAt,
        estimatedDurationMinutes: h.estimatedDurationMinutes,
        date: h.date,
        time: h.startTime,
        duration: h.durationLabel,
        roomUrl: `/meet/${h.id}`,
        participants: h.participants as any,
      });
    }

    return list;
  }, [agendaMeetings, historyMeetings]);

  // Mapear reuniones por clave YYYY-MM-DD
  const eventsByDate = useMemo(() => {
    const map = new Map<string, Meeting[]>();
    for (const meeting of allMeetings) {
      const dateStr =
        meeting.scheduledStartAt ||
        meeting.actualStartAt ||
        meeting.scheduledEndAt ||
        meeting.actualEndAt;
      if (!dateStr) continue;
      const meetingDate = new Date(dateStr);
      if (isNaN(meetingDate.getTime())) continue;

      const key = formatDateToKey(meetingDate);
      const list = map.get(key) || [];
      list.push(meeting);
      map.set(key, list);
    }
    return map;
  }, [allMeetings]);

  // Celdas para la vista de mes (calendario de 7 columnas: Domingo a Sábado)
  const monthCells = useMemo<CalendarDayCell[]>(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0 = Domingo
    const totalDaysInMonth = new Date(year, month + 1, 0).getDate();

    const cells: CalendarDayCell[] = [];

    // Días del mes anterior para rellenar el inicio de la semana
    const prevMonthDays = new Date(year, month, 0).getDate();
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const d = new Date(year, month - 1, prevMonthDays - i);
      const dateKey = formatDateToKey(d);
      cells.push({
        date: d,
        dayNumber: d.getDate(),
        isCurrentMonth: false,
        isToday: isSameDay(d, today),
        isSelected: isSameDay(d, selectedDate),
        dateKey,
        events: eventsByDate.get(dateKey) || [],
      });
    }

    // Días del mes actual
    for (let day = 1; day <= totalDaysInMonth; day++) {
      const d = new Date(year, month, day);
      const dateKey = formatDateToKey(d);
      cells.push({
        date: d,
        dayNumber: day,
        isCurrentMonth: true,
        isToday: isSameDay(d, today),
        isSelected: isSameDay(d, selectedDate),
        dateKey,
        events: eventsByDate.get(dateKey) || [],
      });
    }

    // Días del mes siguiente para completar la cuadrícula de 7 columnas
    const remaining = (7 - (cells.length % 7)) % 7;
    for (let day = 1; day <= remaining; day++) {
      const d = new Date(year, month + 1, day);
      const dateKey = formatDateToKey(d);
      cells.push({
        date: d,
        dayNumber: day,
        isCurrentMonth: false,
        isToday: isSameDay(d, today),
        isSelected: isSameDay(d, selectedDate),
        dateKey,
        events: eventsByDate.get(dateKey) || [],
      });
    }

    return cells;
  }, [currentDate, selectedDate, today, eventsByDate]);

  // Celdas para la vista de semana
  const weekCells = useMemo<CalendarDayCell[]>(() => {
    const startOfWeek = new Date(currentDate);
    const day = startOfWeek.getDay();
    startOfWeek.setDate(startOfWeek.getDate() - day);

    const cells: CalendarDayCell[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      const dateKey = formatDateToKey(d);
      cells.push({
        date: d,
        dayNumber: d.getDate(),
        isCurrentMonth: d.getMonth() === currentDate.getMonth(),
        isToday: isSameDay(d, today),
        isSelected: isSameDay(d, selectedDate),
        dateKey,
        events: eventsByDate.get(dateKey) || [],
      });
    }
    return cells;
  }, [currentDate, selectedDate, today, eventsByDate]);

  // Eventos del día seleccionado
  const selectedDayKey = useMemo(() => formatDateToKey(selectedDate), [selectedDate]);
  const selectedDayEvents = useMemo(() => eventsByDate.get(selectedDayKey) || [], [eventsByDate, selectedDayKey]);

  // Navegación
  const goToNext = () => {
    setCurrentDate((prev) => {
      const d = new Date(prev);
      if (viewMode === 'month') {
        d.setMonth(d.getMonth() + 1);
      } else {
        d.setDate(d.getDate() + 7);
      }
      return d;
    });
  };

  const goToPrevious = () => {
    setCurrentDate((prev) => {
      const d = new Date(prev);
      if (viewMode === 'month') {
        d.setMonth(d.getMonth() - 1);
      } else {
        d.setDate(d.getDate() - 7);
      }
      return d;
    });
  };

  const goToToday = () => {
    const now = new Date();
    setCurrentDate(now);
    setSelectedDate(now);
  };

  const selectDay = (date: Date) => {
    setSelectedDate(date);
    if (date.getMonth() !== currentDate.getMonth()) {
      setCurrentDate(new Date(date));
    }
  };

  return {
    viewMode,
    setViewMode,
    currentDate,
    selectedDate,
    selectDay,
    monthCells,
    weekCells,
    selectedDayEvents,
    selectedDayKey,
    goToNext,
    goToPrevious,
    goToToday,
    isLoading: isLoadingAgenda || isLoadingHistory,
    isError: isErrorAgenda && isErrorHistory,
    refetch: () => {
      refetchAgenda();
      refetchHistory();
    },
    year: currentDate.getFullYear(),
    monthName: MONTHS_NAMES[currentDate.getMonth()],
    monthIndex: currentDate.getMonth(),
  };
}
