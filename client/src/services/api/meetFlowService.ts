import api from "./api";
import type { User, SignupReq } from "@/types/user";


export const signup = async (data: SignupReq) : Promise<User> => {
  const response = await api.post<User>("/signup", data);
  return response.data;
};

