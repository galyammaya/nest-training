import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { getModelToken } from '@nestjs/mongoose';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './interfaces/task.interface';

const mockId: string = 'SomeString';
const mockDto: CreateTaskDto = {
  name: 'TaskName',
  content: 'TaskContent'
};
const mockTask: Task = {
  id: mockId,
  ...mockDto
};
class mockTaskModel {
  constructor(private dto: CreateTaskDto) {}
  save = jest.fn().mockResolvedValue(this.dto);
  static find = jest.fn().mockResolvedValue([mockTask]);
  static findOne = jest.fn().mockImplementation((id: any) => {
    const task: Task = {
      id: id['_id'],
      ...mockDto
    };
    return Promise.resolve(task);
  });
  static findByIdAndUpdate = jest
    .fn()
    .mockImplementation((id: string, updatedTask: Task) => {
      const task: Task = {
        id: id,
        name: updatedTask.name,
        content: updatedTask.content
      };
      return task;
    });
  static findByIdAndDelete = jest.fn().mockImplementation((id: string) => {
    const task: Task = {
      id: id,
      ...mockDto
    };
    return Promise.resolve(task);
  });
}

describe('TasksService', () => {
  let service: TasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getModelToken('Task'),
          useValue: mockTaskModel
        }
      ]
    }).compile();

    service = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find all tasks', async () => {
    expect(service.findAll()).resolves.toEqual([mockTask]);
    expect(mockTaskModel.find).toHaveBeenCalled();
  });

  it('should find task by id', async () => {
    expect(service.findOne(mockId)).resolves.toEqual(mockTask);
    expect(mockTaskModel.findOne).toHaveBeenCalledWith({ _id: mockId });
  });

  it('should create a new task document and return it', async () => {
    expect(Promise.resolve(service.create(mockDto))).toStrictEqual(
      Promise.resolve(mockTask)
    );
  });

  it('should delete a task by id and return it', async () => {
    expect(service.delete(mockId)).resolves.toEqual(mockTask);
    expect(mockTaskModel.findByIdAndDelete).toHaveBeenCalledWith(mockId);
  });

  it('should find a task by id and update it', async () => {
    expect(service.update(mockId, mockTask)).resolves.toEqual(mockTask);
    expect(mockTaskModel.findByIdAndUpdate).toHaveBeenCalledWith(
      mockId,
      mockTask,
      { new: true }
    );
  });
});
