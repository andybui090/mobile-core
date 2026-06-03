import { AuthRepository } from '../../domain/repositories/authRepository';
import { authApi } from '../api/auth.api';

export const authRepositoryImpl: AuthRepository = {
  async getList() {
    const res = await authApi.getList();
    return res.data;
  },
};
