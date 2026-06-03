export const authKeys = {
  all: ['auth'],
  lists: () => [...authKeys.all, 'list'],
  detail: (id: string) => [...authKeys.all, 'detail', id],
};
