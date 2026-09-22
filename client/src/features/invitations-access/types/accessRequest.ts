export type AccessRequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface AccessRequestUserDto {
  id: string;
  fullName: string;
  email: string;
  avatarUrl: string | null;
}

export interface AccessRequestDto {
  id: string;
  meetingId: string;
  userId: string;
  status: AccessRequestStatus;
  processedBy: string | null;
  requestedAt: string;
  processedAt: string | null;
}

export interface AccessRequestWithUserDto extends AccessRequestDto {
  user: AccessRequestUserDto;
}
