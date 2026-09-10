import { User } from '../../users/entities/user.entity.js';

export enum RoomStatus {
  WAITING = 'WAITING',
  ACTIVE = 'ACTIVE',
  CLOSED = 'CLOSED',
}

export class Room {
  id: string;
  hostId: string;
  link: string;
  status: RoomStatus;
  participants: User[];
  createdAt: Date;
}
