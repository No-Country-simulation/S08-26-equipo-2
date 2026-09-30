export type BackendMeetingStatus = 'SCHEDULED' | 'IN_PROGRESS' | 'FINISHED' | 'CANCELLED';

export type MeetingStatus = BackendMeetingStatus | 'live' | 'completed' | 'cancelled' | 'upcoming';

export type MeetingFilterValue = 'all' | BackendMeetingStatus | string;

export interface FilterTabItem {
  value: MeetingFilterValue;
  label: string;
}

export interface MeetingUserDto {
  id: string;
  fullName: string;
  email: string;
  avatarUrl: string | null;
}

export interface MeetingParticipantDto {
  id: string;
  role: 'HOST' | 'CO_HOST' | 'PARTICIPANT' | string;
  connectionStatus: 'WAITING_ROOM' | 'CONNECTED' | 'RECONNECTING' | 'DISCONNECTED' | 'LEFT' | string;
  user: MeetingUserDto;
}

export interface MeetingDto {
  id: string;
  code: string;
  title: string;
  description: string | null;
  hostId: string;
  status: BackendMeetingStatus;
  scheduledStartAt: string | null;
  scheduledEndAt: string | null;
  actualStartAt: string | null;
  actualEndAt: string | null;
  estimatedDurationMinutes: number | null;
  accessType?: string;
  requiresHostApproval?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface MeetingWithParticipantsDto extends MeetingDto {
  participants: MeetingParticipantDto[];
}

export interface CreateMeetingPayload {
  title: string;
  description?: string;
  scheduledStartAt?: string;
  scheduledEndAt?: string;
  estimatedDurationMinutes?: number;
}

export interface Meeting {
  id?: string;
  code?: string;
  title: string;
  name?: string;
  date?: string;
  time?: string;
  duration?: string;
  scheduledStartAt?: string | null;
  scheduledEndAt?: string | null;
  actualStartAt?: string | null;
  actualEndAt?: string | null;
  estimatedDurationMinutes?: number | null;
  participants?: MeetingParticipantDto[] | string[] | number;
  status: MeetingStatus;
  roomUrl?: string;
  description?: string | null;
  hostId?: string;
}

export type Screen = 'history' | 'create-meeting' | 'video-room' | 'dashboard' | string;

export interface MeetingsTableProps {
  onNav?: (screen: Screen) => void;
  onCreateMeeting?: () => void;
  onJoinMeeting?: (meeting: Meeting) => void;
  onEditMeeting?: (meeting: Meeting) => void;
  onCancelMeeting?: (meeting: Meeting) => void;
  onViewDetailsMeeting?: (meeting: Meeting) => void;
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

export const statusLabel: Record<string, string> = {
  SCHEDULED: 'Programada',
  IN_PROGRESS: 'En vivo',
  FINISHED: 'Finalizada',
  CANCELLED: 'Cancelada',
  upcoming: 'Programada',
  live: 'En vivo',
  completed: 'Finalizada',
  cancelled: 'Cancelada',
};

export const statusClass: Record<string, string> = {
  SCHEDULED: 'badge-yellow',
  IN_PROGRESS: 'badge-green',
  FINISHED: 'badge-blue',
  CANCELLED: 'badge-red',
  upcoming: 'badge-yellow',
  live: 'badge-green',
  completed: 'badge-blue',
  cancelled: 'badge-red',
};

export const filterTabs: FilterTabItem[] = [
  { value: 'all', label: 'Todas' },
  { value: 'SCHEDULED', label: 'Programadas' },
  { value: 'IN_PROGRESS', label: 'En vivo' },
];

export interface DurationOption {
  value: string;
  label: string;
}

export const DURATION_OPTIONS: DurationOption[] = [
  { value: '15', label: '15 min' },
  { value: '30', label: '30 min' },
  { value: '45', label: '45 min' },
  { value: '60', label: '60 min' },
  { value: '90', label: '90 min' },
  { value: '120', label: '120 min' },
];
