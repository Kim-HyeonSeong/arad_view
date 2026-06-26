import { api } from './Axios';

interface LoginRequest {
  username: string;
  password: string;
}

interface LoginResponse {
  token: string;
}

export const login = (data: LoginRequest) => {
  return api.post<LoginResponse>('/auth/login', data);
};
