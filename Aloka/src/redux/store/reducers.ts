import { combineReducers } from '@reduxjs/toolkit';
import globalReducer from '@/redux/slices/globalSlice';
import settingReducer from '@/redux/slices/settingSlice';
import profileReducer from '@/redux/slices/profileSlice';
import authReducer from '@/redux/slices/authSlice';

const appReducer = combineReducers({
  globalReducer,
  settingReducer,
  profileReducer,
  authReducer,
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