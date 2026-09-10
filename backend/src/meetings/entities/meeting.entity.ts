import { Room } from '../../rooms/entities/room.entity.js';
export class Meeting {
  id: string;
  room: Room;               
  scheduledAt: Date;        
  startedAt: Date;          
  endedAt: Date;            
  durationMinutes: number;  
}
