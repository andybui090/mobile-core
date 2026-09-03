import Reactotron from 'reactotron-react-native';
import { reactotronRedux } from 'reactotron-redux';
import sagaPlugin from 'reactotron-redux-saga';
import { NativeModules, Platform } from 'react-native';

declare global {
  interface Console {
    tron: any;
  }
}

let reactotron: any = null;

if (__DEV__) {
  let host = 'localhost';
  if (Platform.OS === 'android') {
    const scriptURL = NativeModules.SourceCode?.scriptURL;
    if (scriptURL) {
      host = scriptURL.split('://')[1]?.split(':')[0] || '172.24.105.146';
    }
  }

  reactotron = (Reactotron as any)
    .configure({
      name: 'Aloka',
      host: host,
    })
    .useReactNative({
      asyncStorage: false,
      networking: {
        ignoreUrls: /symbolicate/,
      },
      editor: false,
      errors: { veto: () => false },
      overlay: false,
    })
    .use(reactotronRedux() as any)
    .use(sagaPlugin({} as any) as any)
    .connect();

  console.tron = reactotron;
}

export default reactotron;
