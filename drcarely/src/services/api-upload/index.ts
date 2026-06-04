import createHttpClient from '@/services/httpClient';
import Config from 'react-native-config';
import i18n from 'i18next';

const createUploadClient = (baseURL = Config.BASE_API_URL) => {
  const client = createHttpClient({
    baseURL,
    timeout: 120000, // 120s for file uploads
    headers: {
      'Cache-Control': 'no-cache',
      'x-app-id': '56d4128c-7732-4218-936c-ed5d82a810fb',
      'x-app-content': '',
      'x-app-language': i18n.language,
      'x-app-name': 'DoctorNetwork',
    },
  });

  // File upload helper
  const uploadFile = (url: string, formData: FormData, cancelKey?: string) => {
    return client.post(url, formData, { 
      cancelKey,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  };

  return {
    instance: client.instance,
    uploadFile,
    post: client.post,
    get: client.get,
    put: client.put,
    delete: client.delete,
    setHeader: client.setHeader,
    deleteHeader: client.deleteHeader,
    getHeaders: client.getHeaders,
  };
};

const UploadService = createUploadClient();

export default UploadService;
