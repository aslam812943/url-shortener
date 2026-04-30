import api from './api';
import { API_ROUTES } from '../constants/api-routes';

export interface UrlData {
  id: string;
  originalUrl: string;
  shortCode: string;
  createdAt: string;
}

export const urlService = {
  shorten: async (originalUrl: string): Promise<UrlData> => {
    const response = await api.post(API_ROUTES.URL.SHORTEN, { originalUrl });
    return response.data;
  },

  getMyLinks: async (page: number = 1, limit: number = 10): Promise<UrlData[]> => {
    const response = await api.get(API_ROUTES.URL.MY_LINKS, {
      params: { page, limit }
    });
    return response.data;
  }
};

