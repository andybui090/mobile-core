import { apiClient } from '@/core/network/apiClient';

export const authApi = {
  getList: () => apiClient.get('/auth'),
};
