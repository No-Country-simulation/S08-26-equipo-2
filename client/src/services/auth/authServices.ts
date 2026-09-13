import api from "@/services/api/api"
import type { User, SignupReq, LoginReq } from "@/types/user";


export const signupApi = async (data: SignupReq) : Promise<User> => {
  const response = await api.post<User>("/signup", data);
  return response.data;
};


export const loginApi = async (data: LoginReq) : Promise<User> => {
  const response = await api.post<User>("/login", data);
  return response.data;
};

