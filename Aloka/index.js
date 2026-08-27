/**
 * @format
 */

if (__DEV__) {
  require('./reactotron.config');
}

import { AppRegistry } from 'react-native';
import { name as appName } from './app.json';
import App from './src/ContainerApp';

AppRegistry.registerComponent(appName, () => App);
