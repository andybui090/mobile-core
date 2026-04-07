import { HomeRepository } from '../../domain/repositories/homeRepository';

export const getHome = (repo: HomeRepository) => {
  return () => repo.getList();
};
