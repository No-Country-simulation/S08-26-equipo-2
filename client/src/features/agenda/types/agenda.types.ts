import type { Meeting, Screen } from '@/features/meetings/types/meeting';

export type CalendarViewMode = 'month' | 'week';

export type CalendarEventStatus = 'live' | 'upcoming' | 'completed' | 'cancelled';

export interface CalendarDayCell {
  date: Date;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  dateKey: string; // formato YYYY-MM-DD
  events: Meeting[];
}

export interface AgendaScreenProps {
  onNav?: (screen: Screen) => void;
  className?: string;
}
