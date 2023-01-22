import bcrypt from 'bcrypt';
import request from 'supertest';
import { CreateUserDto } from '../dtos/users.dto';
import AuthRoute from '../routes/auth.route';
import App from '../app';
import { TestHelper } from '../helpers/test.helper';


describe('Testing Auth', () => {
  let superRequest: request.SuperTest<request.Test>
  const userData: CreateUserDto = {
    email: 'test@email.com',
    password: 'q1w2e3r4!',
    name: 'test',
    role: 1
  };

  beforeAll(async () => {
    await TestHelper.instance.setupTestDB();
    const app = new App();
    superRequest = request(app.app);
  });

  afterAll(() => {
    TestHelper.instance.teardownTestDB();
  });
  describe('[POST] /signup', () => {
    it('response should have the Create userData', async () => {
      const authRoute = new AuthRoute();
      return superRequest.post(`${authRoute.path}signup`).send(userData).expect(201);
    });
    it('response should return error if email already registered', async () => {
      const authRoute = new AuthRoute();
      return superRequest
        .post(`${authRoute.path}signup`)
        .send(userData)
        .expect(409)
        .expect({ message: `This email ${userData.email} already exists` });
    });
  });

  describe('[POST] /login', () => {
    it('response should have the Set-Cookie header with the Authorization token', async () => {
      const authRoute = new AuthRoute();

      return superRequest
        .post(`${authRoute.path}login`)
        .send(userData)
        .expect('Set-Cookie', /^Authorization=.+/);
    });
    it('response should return error if email is wrong', async () => {
      const authRoute = new AuthRoute();
      const wrongData = { ...userData, email: "test.wrong@email.com" }

      return superRequest
        .post(`${authRoute.path}login`)
        .send(wrongData)
        .expect(409)
        .expect({ message: `Email and Password not matching` });
    });
    it('response should return error if password is wrong', async () => {
      const authRoute = new AuthRoute();
      const wrongData = { ...userData, password: "123456" }

      return superRequest
        .post(`${authRoute.path}login`)
        .send(wrongData)
        .expect(409)
        .expect({ message: `Email and Password not matching` });
    });
  });

  describe('[POST] /logout', () => {
    it('logout Set-Cookie Authorization=; Max-age=0', async () => {
      const authRoute = new AuthRoute();

      const { cookie } = await authRoute.authController.authService.login(userData);

      return superRequest
        .post(`${authRoute.path}logout`)
        .set('Cookie', cookie)
        .expect('Set-Cookie', /^Authorization=\;/);
    });
    it('response should return error if the cookie is not set', async () => {
      const authRoute = new AuthRoute();

      return superRequest
        .post(`${authRoute.path}logout`)
        .expect(404)
        .expect({ message: `Authentication token missing` });
    });
  });
});
