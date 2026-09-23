import { combineReducers } from '@reduxjs/toolkit';
import globalReducer from '@/redux/slices/globalSlice';
import settingReducer from '@/redux/slices/settingSlice';
import profileReducer from '@/redux/slices/profileSlice';
import authReducer from '@/redux/slices/authSlice';
import homeReducer from '@/redux/slices/homeSlice';
import carelyReducer from '@/redux/slices/carelySlice';
import notifyReducer from '@/redux/slices/notificationSlice';
import onboardReducer from '@/redux/slices/onboardSlice';

const appReducer = combineReducers({
  globalReducer,
  settingReducer,
  profileReducer,
  authReducer,
  homeReducer,
  carelyReducer,
  notifyReducer,
  onboardReducer,
});

export const clearReducer = () => ({ type: 'CLEAR_REDUCER' });

export const rootReducer = (state: any, action: any) => {
  if (action.type === 'CLEAR_REDUCER') {
    const globalState = state?.globalReducer;
    const resetState = appReducer(undefined, action);
    return {
      ...resetState,
      globalReducer: globalState || resetState.globalReducer,
    };
  }
  return appReducer(state, action);
};

export default rootReducer;