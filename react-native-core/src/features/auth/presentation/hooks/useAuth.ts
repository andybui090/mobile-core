import { useQuery } from '@tanstack/react-query';
import { authRepositoryImpl } from '@/features/auth/data/repositories/authRepositoryImpl';
import { getAuth } from '@/features/auth/application/usecases/getAuth';

export const useAuth = () => {
  const queryFn = getAuth(authRepositoryImpl);

  return useQuery({
    queryKey: ['auth'],
    queryFn,
  });
};
