import { http } from '@/services/http/httpClient';

export const authApi = {
  getList: () => http.get('/auth'),
};
