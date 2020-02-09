import {Injectable, NotFoundException} from '@nestjs/common';
import {CreateTaskDto} from "./dto/create-task.dto";
import {GetTasksFilterDto} from "./dto/get-tasks-filter.dto";
import {TaskStatus} from "./enums/TaskStatus.enum";
import {Task} from "./domain/Task.entity";
import {TaskRepository} from "./repos/TaskRepository.repository";
import {InjectRepository} from "@nestjs/typeorm";

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(TaskRepository) private taskRepository: TaskRepository) {
    }

    async getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
        return this.taskRepository.getTasks(filterDto);
    }

    async getTaskById(id: number): Promise<Task> {              // Asynchronous method.
        const found = await this.taskRepository.findOne(id);    /* Will stop its execution till
                                                                * this operation won't be ended.*/

        if (!found) {
            throw new NotFoundException(`Task with ID "${id}" not found.`);
        }

        return found;
    }



    async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
        return this.taskRepository.createTask(createTaskDto);
    }



    async deleteTaskById(id: number): Promise<void> {
        const result = await this.taskRepository.delete(id);

        if (result.affected === 0) {
            throw new NotFoundException(`Task with ID "${id}" not found.`);
        }
        // const entityToDelete = this.getTaskById(id);
        //
        // return await this.taskRepository.remove(entityToDelete);
    }



    async updateTaskStatus(id: number, status: TaskStatus): Promise<Task> {
        const taskToFind = await this.getTaskById(id);

        taskToFind.status = status;
        await taskToFind.save();

        return taskToFind;
    }
    // updateTaskStatus(id: string, status: TaskStatus): Task {
    //     const task = this.getTaskById(id);
    //     task.status = status;
    //     return task;
    // }
}
