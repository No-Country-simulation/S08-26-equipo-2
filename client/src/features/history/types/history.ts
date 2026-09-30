export interface HistoryUserDto {
  id: string;
  fullName: string;
  email: string;
  avatarUrl: string | null;
}

export interface HistoryParticipantDto {
  id: string;
  role: string;
  connectionStatus: string;
  joinedAt: string | null;
  leftAt: string | null;
  user: HistoryUserDto;
}

export interface HistoryMeetingDto {
  id: string;
  code: string;
  title: string;
  description: string | null;
  hostId: string;
  status: 'FINISHED' | string;
  scheduledStartAt: string | null;
  scheduledEndAt: string | null;
  actualStartAt: string | null;
  actualEndAt: string | null;
  estimatedDurationMinutes: number | null;
  createdAt?: string;
  updatedAt?: string;
  participants: HistoryParticipantDto[];
}

export interface HistoryMeetingUI extends HistoryMeetingDto {
  date: string;
  startTime: string;
  endTime: string;
  durationLabel: string;
}

export interface HistoryTableProps {
  className?: string;
}
