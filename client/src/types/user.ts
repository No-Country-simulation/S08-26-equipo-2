
export type User = {
  id: number;
  name: string;
  email: string;
  password: string;
  isActive: boolean;
};

export type SignupReq = {
  name: string;
  email: string;
  password: string;
};

export type LoginReq = {
  email: string;
  password: string;
};

export type LoginRes= {
  token: string;
  user: User;
};