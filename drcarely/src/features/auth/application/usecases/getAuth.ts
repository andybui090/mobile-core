import { AuthRepository } from '../../domain/repositories/authRepository';

export const getAuth = (repo: AuthRepository) => {
  return () => repo.getList();
};
