import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { Todo } from './todo.schema';
import { TodoService } from './todo.service';

describe('TodoService', () => {
  let service: TodoService;
  const exec = { exec: jest.fn() };
  const todoFactory = () => ({
    findById: () => exec,
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodoService,
        {
          provide: getModelToken(Todo.name),
          useFactory: todoFactory,
        },
      ],
    }).compile();

    service = module.get<TodoService>(TodoService);
  });

  it('getById working', async () => {
    const _id = new Types.ObjectId().toHexString();
    todoFactory().findById().exec.mockReturnValueOnce({ title: 'mock', description: 'mock', _id });
    const res = await service.getById(_id);
    expect(res?._id).toBe(_id);
  });
});
