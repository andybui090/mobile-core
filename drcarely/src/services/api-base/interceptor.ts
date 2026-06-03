// import { storeObjectData, getObjectData } from '@/storages';
// import { AUTH } from './uris';
// import { STORAGEKEY } from '@/constants';
// import DeviceInfo from 'react-native-device-info';

// export default (api: any) => {
//     api.axiosInstance.interceptors.response.use(
//         (response: any) => {
//             return response;
//         },
//         async (error: any) => {
//             let originalRequest = error.config;
//             if (
//                 error.response &&
//                 error.response.status === 401 &&
//                 !originalRequest._retry &&
//                 !originalRequest.headers._retry
//             ) {
//                 // console.log('LOG_status_401_error', '-> refreshing now ');
//                 originalRequest._retry = true;
//                 const credentials = await getObjectData(STORAGEKEY.JWT_TOKEN);
//                 if (credentials && credentials.refresh_token) {
//                     // api call for access token using refresh token
//                     return new Promise(async (resolve, reject) => {
//                         const deviceId = await DeviceInfo.getUniqueId();
//                         const response = await api.post(AUTH.REFRESH_TOKEN,
//                             {
//                                 "refreshToken": credentials.refresh_token,
//                                 // "deviceId": "5060773e88bae185bd6124a99c0a2888", 
//                                 "deviceId": deviceId || "",
//                                 // "deviceType": "mobile",
//                                 "phone": credentials.phone || "",
//                                 // refresh_token:credentials.refresh_token
//                             }, { headers: { _retry: true } });
//                         //store access_token and data
//                         if (response.ok && response.status === 200) {
//                             const { result } = response.data;
//                             await storeObjectData(STORAGEKEY.JWT_TOKEN, result);
//                             api.setHeader('Authorization', 'Bearer ' + result.access_token);
//                             originalRequest.headers.Authorization = 'Bearer ' + result.access_token;
//                             resolve(api.axiosInstance(originalRequest));
//                         } else {
//                             // store.dispatch(AuthActions.forceLogout());
//                             return Promise.resolve(error);
//                         }
//                     });
//                 } else {
//                     return Promise.resolve(error);
//                 }
//             } else {
//                 return Promise.resolve(error);
//             }
//         },
//     );
// };
