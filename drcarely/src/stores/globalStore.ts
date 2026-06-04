import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import ApiService from '@/services/api-base';
import { responseListProps } from '@/stores/types';

export type GlobalStateResponse = responseListProps;

export type GlobalStoreState = {
  tutorialList: GlobalStateResponse;
  updateCategories: {
    isUpdate: boolean;
  };
  fetchTutorials: (payload?: object) => Promise<void>;
  toggleUpdateCategories: () => void;
};

const createResponseState = (): GlobalStateResponse => ({
  loading: false,
  data: undefined,
  error: undefined,
});

let requestSeq = 0;

export const useGlobalStore = create<GlobalStoreState>()(
  devtools(
    set => ({
      tutorialList: createResponseState(),
      updateCategories: { isUpdate: true },

      fetchTutorials: async (payload = {}) => {
        const requestId = ++requestSeq;
        set(
          state => ({
            tutorialList: { ...state.tutorialList, loading: true, error: undefined },
          }),
          false,
          'fetchTutorials/loading',
        );

        try {
          const response = await ApiService.getTutorials(payload);
          if (requestId !== requestSeq) return;

          const { problem, data, status } = response;
          if (!problem && [200, 201, 204].includes(status)) {
            set(
              { tutorialList: { loading: false, data: data ?? {}, error: undefined } },
              false,
              'fetchTutorials/success',
            );
          } else {
            set(
              {
                tutorialList: {
                  loading: false,
                  data: undefined,
                  error: Object.assign(data || {}, { status, problem }),
                },
              },
              false,
              'fetchTutorials/error',
            );
          }
        } catch (error: any) {
          if (requestId !== requestSeq) return;
          set(
            { tutorialList: { loading: false, data: undefined, error } },
            false,
            'fetchTutorials/catch',
          );
        }
      },

      toggleUpdateCategories: () =>
        set(
          state => ({
            updateCategories: { isUpdate: !state.updateCategories.isUpdate },
          }),
          false,
          'toggleUpdateCategories',
        ),
    }),
    { name: 'GlobalStore' },
  ),
);

export const tutorialListSelector = (state: GlobalStoreState) => state.tutorialList;
export const fetchTutorialsSelector = (state: GlobalStoreState) => state.fetchTutorials;
export const updateCategoriesSelector = (state: GlobalStoreState) => state.updateCategories;
