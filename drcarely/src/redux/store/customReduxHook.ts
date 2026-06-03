import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { rootReducer, store } from '@/redux/store';

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof rootReducer>;
type DispatchFunc = () => AppDispatch;
export const useAppDispatch: DispatchFunc = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;