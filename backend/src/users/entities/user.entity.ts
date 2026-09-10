export enum UserRole {
  HOST = 'HOST',
  PARTICIPANT = 'PARTICIPANT',
}

export class User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
}
