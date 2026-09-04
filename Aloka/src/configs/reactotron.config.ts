import Reactotron from 'reactotron-react-native';
import { NativeModules, Platform } from 'react-native';

let reactotronRedux: any = null;
let sagaPlugin: any = null;
try {
  reactotronRedux = require('reactotron-redux')?.reactotronRedux;
} catch (e) {}
try {
  sagaPlugin = require('reactotron-redux-saga')?.default || require('reactotron-redux-saga');
} catch (e) {}

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

  let tron = (Reactotron as any)
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
    });

  if (reactotronRedux) {
    tron = tron.use(reactotronRedux());
  }
  if (sagaPlugin) {
    tron = tron.use(sagaPlugin({}));
  }
  reactotron = tron.connect();

  console.tron = reactotron;
}

export default reactotron;
