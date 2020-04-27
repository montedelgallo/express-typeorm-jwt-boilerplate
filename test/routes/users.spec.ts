import { TestFactory } from '../factory';

describe('User Endpoints', () => {
  const factory: TestFactory = new TestFactory();

  beforeAll(async () => {
    await factory.init();
  });

  afterAll(async () => {
    await factory.close();
  });

  describe('GET /users', () => {
    it('responds with status 200', async done => {
      const res = await factory.app.get('/api/users').send();
      expect(res.status).toEqual(200);
      done();
    });

    it('responds with an array', async done => {
      const res = await factory.app.get('/api/users').send();
      expect(res.body).toBeInstanceOf(Array);
      done();
    });
  });
});
