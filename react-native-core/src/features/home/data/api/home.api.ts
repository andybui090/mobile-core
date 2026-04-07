import { apiClient } from '@/core/network/apiClient';

export const homeApi = {
  getList: () => apiClient.get('/home'),
};
