import { HomeRepository } from '../../domain/repositories/homeRepository';
import { homeApi } from '../api/home.api';

export const homeRepositoryImpl: HomeRepository = {
  async getList() {
    const res = await homeApi.getList();
    return res.data;
  },
};
