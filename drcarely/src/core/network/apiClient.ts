import axios from 'axios';
import { ENV } from '@/core/config/env';

export const apiClient = axios.create({
  baseURL: ENV.API_URL,
});