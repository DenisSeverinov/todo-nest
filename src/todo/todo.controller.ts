import { JwtAuthGuard } from './../auth/guard/jwt.guard';
import {
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  Body,
  Param,
  HttpException,
  HttpStatus,
  ValidationPipe,
  UsePipes,
  UseGuards,
} from '@nestjs/common';
import { TodoDto } from './dto/create-todo.dto';
import { TODO_NOT_FOUND } from './todo.constants';
import { TodoService } from './todo.service';

@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll() {
    return this.todoService.getAll();
  }

  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  @Post('create')
  async create(@Body() dto: TodoDto) {
    return this.todoService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getById(@Param('id') id: string) {
    const found = await this.todoService.getById(id);
    if (!found) {
      throw new HttpException(TODO_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    return found;
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    const deleted = await this.todoService.delete(id);
    if (!deleted) {
      throw new HttpException(TODO_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: TodoDto) {
    const patched = await this.todoService.update(id, dto);
    if (!patched) {
      throw new HttpException(TODO_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
  }
}
