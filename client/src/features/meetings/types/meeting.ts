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
  participants: string[] | number;
  status: MeetingStatus;
  roomUrl?: string;
  description?: string;
}

export type Screen = 'history' | 'create-meeting' | 'video-room' | 'dashboard' | string;

export interface MeetingsTableProps {
  onNav?: (screen: Screen) => void;
  onCreateMeeting?: () => void;
  onJoinMeeting?: (meeting: Meeting) => void;
  onEditMeeting?: (meeting: Meeting) => void;
  onCancelMeeting?: (meeting: Meeting) => void;
  className?: string;
  title?: string;
  showCreateButton?: boolean;
}

export interface MeetingFormProps {
  initialData?: Meeting;
  onSuccess: (meeting: Meeting) => void;
  className?: string;
}

export type CreateMeetingFormProps = MeetingFormProps;

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

export interface DurationOption {
  value: string;
  label: string;
}

export const DURATION_OPTIONS: DurationOption[] = [
  { value: "15", label: "15 min" },
  { value: "30", label: "30 min" },
  { value: "45", label: "45 min" },
  { value: "60", label: "60 min" },
  { value: "90", label: "90 min" },
  { value: "120", label: "120 min" },
];
