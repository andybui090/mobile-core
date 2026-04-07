import { useQuery } from '@tanstack/react-query';
import { getHome } from '../../application/usecases/getHome';
import { homeRepositoryImpl } from '../../data/repositories/homeRepositoryImpl';
import { homeKeys } from '../home.keys';

export const useHome = () => {
  const queryFn = getHome(homeRepositoryImpl);

  return useQuery({
    queryKey: homeKeys.lists(),
    queryFn,
  });
};
