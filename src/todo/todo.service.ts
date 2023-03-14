import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TodoDto } from './dto/create-todo.dto';
import { Todo, TodoDocument } from './todo.schema';

class Leak {}

const leaks = [];

@Injectable()
export class TodoService {
  constructor(@InjectModel(Todo.name) private readonly todoModel: Model<TodoDocument>) {}

  async getAll() {
    leaks.push(new Leak());
    return this.todoModel.find().exec();
  }

  async getById(id: string) {
    return this.todoModel.findById(id).exec();
  }

  async create(dto: TodoDto) {
    return new this.todoModel(dto).save();
  }

  async delete(id: string) {
    return this.todoModel.findByIdAndDelete(id).exec();
  }

  async update(id: string, dto: TodoDto) {
    return this.todoModel.findByIdAndUpdate(id, dto).exec();
  }
}
