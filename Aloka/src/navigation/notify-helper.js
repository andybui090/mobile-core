const detectNotify = async (payload, navigationRef, dispatchSaga, user) => {
  console.log('🚀 ~ file: notify-helper ~ payload:', payload);
};

const detectFirebaseOpenApp = async (navigationRef, payload) => {
  console.log('🚀 ~ detectFirebaseOpenApp ~ payload:', payload);
};

const detectDeeplinkOpenApp = payload => {
  console.log('🚀 ~ detectDeeplinkOpenApp ~ payload:', payload?.params);
};

export { detectDeeplinkOpenApp, detectFirebaseOpenApp, detectNotify };
