import { Injectable } from '@nestjs/common';
import { Task } from './interfaces/task.interface';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class TasksService {
  constructor(@InjectModel('Task') private readonly taskModel: Model<Task>) {}

  async findAll(): Promise<Task[]> {
    return await this.taskModel.find();
  }

  async findOne(id: string): Promise<Task> {
    return this.taskModel.findOne({ _id: id });
  }

  async create(task: Task): Promise<Task> {
    const newTask = new this.taskModel(task);
    return await newTask.save();
  }

  async delete(id: string): Promise<Task> {
    return await this.taskModel.findByIdAndDelete(id);
  }

  async update(id: string, updatedTask: Task): Promise<Task> {
    return await this.taskModel.findByIdAndUpdate(id, updatedTask, {
      new: true
    });
  }
}
