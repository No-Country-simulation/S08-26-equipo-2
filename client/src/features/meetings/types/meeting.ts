export type MeetingStatus = 'live' | 'completed' | 'cancelled' | 'upcoming';

export type MeetingFilterValue = 'all' | MeetingStatus;

export interface FilterTabItem {
  value: MeetingFilterValue;
  label: string;
}

export interface Meeting {
  id?: string;
  name: string;
  date: string;
  time: string;
  duration: string;
  participants: number;
  status: MeetingStatus;
  roomUrl?: string;
  description?: string;
}

export type Screen = 'history' | 'create-meeting' | 'video-room' | 'dashboard' | string;

export interface MeetingsTableProps {
  onNav?: (screen: Screen) => void;
  onCreateMeeting?: () => void;
  onJoinMeeting?: (meeting: Meeting) => void;
  className?: string;
  title?: string;
  showCreateButton?: boolean;
}

export const statusLabel: Record<MeetingStatus, string> = {
  live: 'En vivo',
  completed: 'Completada',
  cancelled: 'Cancelada',
  upcoming: 'Próxima',
};

export const statusClass: Record<MeetingStatus, string> = {
  live: 'badge-green',
  completed: 'badge-blue',
  cancelled: 'badge-red',
  upcoming: 'badge-yellow',
};

export const filterTabs: FilterTabItem[] = [
  { value: 'all', label: 'Todas' },
  { value: 'live', label: 'En vivo' },
  { value: 'completed', label: 'Completadas' },
  { value: 'upcoming', label: 'Próximas' },
  { value: 'cancelled', label: 'Canceladas' },
];
