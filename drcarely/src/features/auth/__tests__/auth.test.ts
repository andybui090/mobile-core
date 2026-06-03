import { getAuth } from '../application/usecases/getAuth';

describe('Auth usecase', () => {
  it('should return data', async () => {
    const mockRepo = {
      getList: jest.fn().mockResolvedValue([{ id: '1' }]),
    };

    const result = await getAuth(mockRepo)();

    expect(result).toEqual([{ id: '1' }]);
  });
});
