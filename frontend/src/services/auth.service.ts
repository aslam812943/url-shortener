import api from './api';
import type { LoginData, RegisterData, User } from '../types/auth';
import { API_ROUTES } from '../constants/api-routes';

export const authService = {
  async login(data: LoginData): Promise<{ user: User }> {
    const response = await api.post<{ user: User }>(API_ROUTES.AUTH.LOGIN, data);
    return response.data;
  },

  async register(data: RegisterData): Promise<{ message: string; userId: string }> {
    const response = await api.post(API_ROUTES.USER.REGISTER, data);
    return response.data;
  },

  async logout(): Promise<void> {
    await api.post(API_ROUTES.AUTH.LOGOUT);
  },

  async getMe(): Promise<User | null> {
    try {
      const response = await api.get<User>(API_ROUTES.AUTH.ME);
      return response.data;
    } catch (error) {
      return null;
    }
  },
};
