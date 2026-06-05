import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import ApiService from '@/services/api-base';
import {
  errorPayload,
  listSuccessPayload,
  responseListProps,
} from '@/stores/types';

export type GlobalStateResponse = responseListProps;

export type GlobalStoreState = {
  tutorialList: GlobalStateResponse;
  fetchTutorials: (payload?: object) => Promise<void>;
};

const SUCCESS_STATUSES = [200, 201, 204];

const createResponseState = (): GlobalStateResponse => ({
  loading: false,
  data: undefined,
  error: undefined,
});

const createLoadingState = (
  state: GlobalStateResponse,
): GlobalStateResponse => ({
  ...state,
  loading: true,
  error: undefined,
});

const createSuccessState = (
  data?: listSuccessPayload,
): GlobalStateResponse => ({
  loading: false,
  data,
  error: undefined,
});

const createErrorState = (error?: errorPayload): GlobalStateResponse => ({
  loading: false,
  data: undefined,
  error,
});

const normalizeApiError = (
  data: any,
  status?: number | null,
  problem?: string | null,
): errorPayload =>
  ({
    ...(data || {}),
    status,
    problem,
  }) as errorPayload;

let requestSeq = 0;

export const useGlobalStore = create<GlobalStoreState>()(
  devtools(
    set => ({
      tutorialList: createResponseState(),

      fetchTutorials: async (payload = {}) => {
        const requestId = ++requestSeq;
        set(
          state => ({
            tutorialList: createLoadingState(state.tutorialList),
          }),
          false,
          'fetchTutorials/loading',
        );

        try {
          const response = await ApiService.getTutorials(payload);
          if (requestId !== requestSeq) return;

          const { problem, data, status } = response;
          if (
            !problem &&
            status !== null &&
            SUCCESS_STATUSES.includes(status)
          ) {
            set(
              { tutorialList: createSuccessState(data) },
              false,
              'fetchTutorials/success',
            );
          } else {
            set(
              {
                tutorialList: createErrorState(
                  normalizeApiError(data, status, problem),
                ),
              },
              false,
              'fetchTutorials/error',
            );
          }
        } catch (error: any) {
          if (requestId !== requestSeq) return;
          set(
            { tutorialList: createErrorState(error) },
            false,
            'fetchTutorials/catch',
          );
        }
      },
    }),
    { name: 'GlobalStore' },
  ),
);

export const tutorialListSelector = (state: GlobalStoreState) =>
  state.tutorialList;

export const fetchTutorialsSelector = (state: GlobalStoreState) =>
  state.fetchTutorials;
