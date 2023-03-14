import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { disconnect, Types } from 'mongoose';
import { TODO_NOT_FOUND } from '../src/todo/todo.constants';
import { AuthDto } from 'src/auth/dto/auth.dto';

const todoDto = {
  title: 'title',
  description: 'description',
};

const randomId = new Types.ObjectId().toHexString();

const changedTodo = { title: 'newTitle', description: 'newDescription' };

const loginDto: AuthDto = {
  login: 'test@test.com',
  password: 'test',
};

const foundError = {
  statusCode: 404,
  message: TODO_NOT_FOUND,
};

describe('TodoController (e2e)', () => {
  let app: INestApplication;
  let createdId: string;
  let createdDate: string;
  let token: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const { body } = await request(app.getHttpServer()).post('/auth/login').send(loginDto);
    token = body.access_token;
  });

  it('/todo/create (POST)', async () => {
    const result = await request(app.getHttpServer())
      .post('/todo/create')
      .set('Authorization', 'Bearer ' + token)
      .send(todoDto);
    createdId = result.body._id;
    createdDate = result.body.created_at;

    expect(result.status).toBe(201);
    expect(createdId).toBeDefined();
  });

  it('/todo/:id (GET)', async () => {
    const result = await request(app.getHttpServer())
      .get('/todo/' + createdId)
      .set('Authorization', 'Bearer ' + token);

    expect(result.status).toBe(200);
    expect(result.body).toStrictEqual({
      ...todoDto,
      _id: createdId,
      created_at: createdDate,
    });
  });

  it('/todo (GET)', async () => {
    const ids = [];

    for (let i = 0; i <= 3; i++) {
      const result = await request(app.getHttpServer())
        .post('/todo/create')
        .set('Authorization', 'Bearer ' + token)
        .send(todoDto);
      ids.push(result.body._id);
    }

    const result = await request(app.getHttpServer())
      .get('/todo')
      .set('Authorization', 'Bearer ' + token);
    expect(result.status).toBe(200);
    expect(result.body.length).toBeGreaterThanOrEqual(ids.length);

    for (let i = 0; i < ids.length; i++) {
      await request(app.getHttpServer())
        .delete('/todo/' + ids[i])
        .set('Authorization', 'Bearer ' + token);
    }
  });

  it('/todo/:id (PATCH) - success', async () => {
    return request(app.getHttpServer())
      .patch('/todo/' + createdId)
      .set('Authorization', 'Bearer ' + token)
      .send(changedTodo)
      .expect(200);
  });

  it('/todo/:id (PATCH) - fail', async () => {
    const result = await request(app.getHttpServer())
      .patch('/todo/' + randomId)
      .set('Authorization', 'Bearer ' + token)
      .send(changedTodo);

    expect(result.status).toBe(404);
    expect(result.body).toEqual(foundError);
  });

  it('/todo/:id (DELETE) - success', async () => {
    return request(app.getHttpServer())
      .delete('/todo/' + createdId)
      .set('Authorization', 'Bearer ' + token)
      .expect(200);
  });

  it('/todo/:id (DELETE) - fail', async () => {
    const result = await request(app.getHttpServer())
      .delete('/todo/' + randomId)
      .set('Authorization', 'Bearer ' + token);

    expect(result.status).toBe(404);
    expect(result.body).toEqual(foundError);
  });

  afterAll(() => {
    disconnect();
  });
});
