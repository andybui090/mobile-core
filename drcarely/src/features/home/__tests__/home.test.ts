import { getHome } from '../application/usecases/getHome';

describe('Home usecase', () => {
  it('should return data', async () => {
    const mockRepo = {
      getList: jest.fn().mockResolvedValue([{ id: '1' }]),
    };

    const result = await getHome(mockRepo)();

    expect(result).toEqual([{ id: '1' }]);
  });
});
