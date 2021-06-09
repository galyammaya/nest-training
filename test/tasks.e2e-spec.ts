import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { TasksModule } from '../src/tasks/tasks.module';
import { getModelToken } from '@nestjs/mongoose';
import { Task } from '../src/tasks/interfaces/task.interface';
import { CreateTaskDto } from '../src/tasks/dto/create-task.dto';

describe('TasksController (e2e)', () => {
  let app: INestApplication;

  const mockTasks: Task[] = [
    { id: 'asdasd', name: 'asdasd', content: 'asdasd' },
    { id: '123123', name: '123123', content: '123123' }
  ];
  class mockTaskModel {
    constructor(private dto: CreateTaskDto) {}
    save = jest.fn().mockResolvedValue(this.dto);
    static find = jest.fn().mockResolvedValue(mockTasks);
  }

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TasksModule]
    })
      .overrideProvider(getModelToken('Task'))
      .useValue(mockTaskModel)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  it('/tasks (GET)', () => {
    return request(app.getHttpServer())
      .get('/tasks')
      .expect(200)
      .expect(mockTasks);
  });

  it('/tasks (POST) -> 400 on validation error', () => {
    return request(app.getHttpServer())
      .post('/tasks')
      .send({ name: 123, content: 345 })
      .expect('Content-Type', /json/)
      .expect(400);
  });
});
