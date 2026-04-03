import { authApi } from '../../api/authApi';

export const getAuth = async () => {
  return authApi.getList();
};
