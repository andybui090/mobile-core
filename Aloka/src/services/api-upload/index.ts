import { create } from 'apisauce';
import i18n from 'i18next';
import apiMonitor from '@/services/api-base/monitor';

const createApiClient = (baseURL = 'https://encoding-chat.doctornetwork.us') => {
  const api = create({
    baseURL,
    headers: {
      Accept: 'application/json',
      'Cache-Control': 'no-cache',
      'Content-Type': 'multipart/form-data',
      'x-app-id': '56d4128c-7732-4218-936c-ed5d82a810fb',
      'x-app-language': i18n.language,
      'x-app-name': "DoctorNetwork",
    },
    // timeout: 20000,
  });

  api.addMonitor(apiMonitor);

  const setAuthorizationHeader = (access_token: string) => {
    return api.setHeader('Authorization', 'Bearer ' + access_token);
  };

  const uploadVideo = async (body: FormData) => {
    return await api.post('/upload', body, { headers: { 'Content-Type': 'multipart/form-data' } });
  };

  const deleteAuthorizationHeader = () => delete api.headers.Authorization;

  return {
    uploadVideo,
    setAuthorizationHeader,
    deleteAuthorizationHeader,
    api,
  };
};

const APIUpload = createApiClient();

export default APIUpload;
