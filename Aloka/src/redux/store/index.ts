import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import rootSaga from '@/redux/sagas';
import rootReducer from './reducers';
import reactotron from '@/configs/reactotron.config';

const sagaMonitor =
  __DEV__ && reactotron && typeof reactotron.createSagaMonitor === 'function'
    ? reactotron.createSagaMonitor()
    : undefined;

const sagaMiddleware = createSagaMiddleware({ sagaMonitor });
const middlewares = [sagaMiddleware];

const enhancers: any[] = [];
if (
  __DEV__ &&
  reactotron &&
  typeof reactotron.createEnhancer === 'function'
) {
  enhancers.push(reactotron.createEnhancer());
}

const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }).concat(middlewares),
  enhancers: getDefaultEnhancers => getDefaultEnhancers().concat(enhancers),
  devTools: __DEV__,
});

// Start rootSaga
sagaMiddleware.run(rootSaga);
export { store, rootReducer };