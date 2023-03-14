import { INestApplication } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { AuthDto } from '../src/auth/dto/auth.dto';
import { USER_NOT_FOUND_ERROR, WRONG_PASSWORD_ERROR } from '../src/auth/auth.constants';
import { disconnect } from 'mongoose';

const loginDto: AuthDto = {
  login: 'test@test.com',
  password: 'test',
};

const authError = {
  statusCode: 401,
  message: USER_NOT_FOUND_ERROR,
  error: 'Unauthorized',
};

const passwordError = {
  statusCode: 401,
  message: WRONG_PASSWORD_ERROR,
  error: 'Unauthorized',
};

describe('AuthController e2e', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/auth/login (POST) - success', async () => {
    const result = await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto)
      .expect(200);

    expect(result.body.access_token).toBeDefined();
  });

  it('/auth/login (POST) - login error', async () => {
    const result = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ ...loginDto, login: 'test' });

    expect(result.body).toEqual(authError);
  });

  it('/auth/login (POST) - password error', async () => {
    const result = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ ...loginDto, password: 'error' });

    expect(result.body).toEqual(passwordError);
  });

  afterAll(() => {
    disconnect();
  });
});
