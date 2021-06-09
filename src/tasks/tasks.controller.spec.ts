import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { Task } from './interfaces/task.interface';
import { strict } from 'assert';
import { CreateTaskDto } from './dto/create-task.dto';

describe('TasksController', () => {
  let controller: TasksController;

  const mockTasksService = {
    findAll: jest.fn(() => {
      return [];
    }),
    findOne: jest.fn((id) => {
      return {
        id: id,
        name: expect.any(String),
        content: expect.any(String)
      };
    }),
    create: jest.fn((dto) => {
      return {
        id: Date.now().toString(),
        ...dto
      };
    }),
    delete: jest.fn((id) => {
      return {
        id: id,
        name: expect.any(String),
        content: expect.any(String)
      };
    }),
    update: jest.fn((id, dto) => {
      return {
        id: id,
        ...dto
      };
    })
  };

  const mockDto: CreateTaskDto = {
    name: 'TaskName',
    content: 'Content'
  };

  const mockId: String = 'SomeString';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [TasksService]
    })
      .overrideProvider(TasksService)
      .useValue(mockTasksService)
      .compile();

    controller = module.get<TasksController>(TasksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should find all tasks', () => {
    expect(controller.findAll()).toStrictEqual(expect.any(Array));

    expect(mockTasksService.findAll).toBeCalled();
  });

  it('should find one task', () => {
    expect(controller.findOne(mockId)).toEqual({
      id: mockId,
      name: expect.any(String),
      content: expect.any(String)
    });

    expect(mockTasksService.findOne).toBeCalledWith(mockId);
  });

  it('should create a task', () => {
    expect(controller.create(mockDto)).toEqual({
      id: expect.any(String),
      name: mockDto.name,
      content: mockDto.content
    });

    expect(mockTasksService.create).toBeCalledWith(mockDto);
  });

  it('should delete one task', () => {
    expect(controller.delete(mockId)).toEqual({
      id: mockId,
      name: expect.any(String),
      content: expect.any(String)
    });

    expect(mockTasksService.delete).toBeCalledWith(mockId);
  });

  it('should update a task', () => {
    expect(controller.update(mockDto, mockId)).toEqual({
      id: mockId,
      ...mockDto
    });

    expect(mockTasksService.update).toBeCalledWith(mockId, mockDto);
  });
});
