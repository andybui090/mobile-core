import { combineReducers } from '@reduxjs/toolkit';
import globalReducer from '@/redux/slices/globalSlice';

const appReducer = combineReducers({
  globalReducer,
});

export const clearReducer = () => ({ type: 'CLEAR_REDUCER' });

export const rootReducer = (state: any, action: any) => {
  if (action.type === 'CLEAR_REDUCER') {
    let stateCopy = JSON.parse(JSON.stringify(state));
    for (const [key, value] of Object.entries(state)) {
      if (key !== 'globalReducer') {
        if (value) {
          for (const [key1, value1] of Object.entries(value)) {
            stateCopy[key][key1] = {};
          }
        }
      }
    }
    return appReducer(stateCopy, action);
  }
  return appReducer(state, action);
};

export default rootReducer;