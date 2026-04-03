import { useQuery } from '@tanstack/react-query';
import { getAuth } from '../domain/usecases/getAuth';

export const useAuth = () => {
  return useQuery({
    queryKey: ['auth'],
    queryFn: getAuth,
  });
};
