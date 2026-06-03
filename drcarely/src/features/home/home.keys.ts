export const homeKeys = {
  all: ['home'],
  lists: () => [...homeKeys.all, 'list'],
  detail: (id: string) => [...homeKeys.all, 'detail', id],
};
