import {Injectable, NotFoundException} from '@nestjs/common';
import {CreateTaskDto} from "./dto/create-task.dto";
import {GetTasksFilterDto} from "./dto/get-tasks-filter.dto";
import {TaskStatus} from "./enums/TaskStatus.enum";
import {Task} from "./domain/Task.entity";
import {TaskRepository} from "./repos/TaskRepository.repository";
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "../auth/domain/user.entity";

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(TaskRepository) private taskRepository: TaskRepository) {
    }

    async getTasks(
        filterDto: GetTasksFilterDto,
        user: User
    ): Promise<Task[]> {
        return this.taskRepository.getTasks(filterDto, user);
    }

    async getTaskById(
        id: number,
        user: User
    ): Promise<Task> {              // Asynchronous method.
        const found = await this.taskRepository.findOne({where: {
            id,
                userId: user.id,
            }});    /* Will stop its execution till
                                                                * this operation won't be ended.*/

        if (!found) {
            throw new NotFoundException(`Task with ID "${id}" not found.`);
        }

        return found;
    }



    async createTask(
        createTaskDto: CreateTaskDto,
        user: User,
    ): Promise<Task> {
        return this.taskRepository.createTask(createTaskDto, user);
    }



    async deleteTaskById(
        id: number,
        user: User,
    ): Promise<void> {
        const result = await this.taskRepository.delete({id,
                                                        userId: user.id});

        if (result.affected === 0) {
            throw new NotFoundException(`Task with ID "${id}" not found.`);
        }
        // const entityToDelete = this.getTaskById(id);
        //
        // return await this.taskRepository.remove(entityToDelete);
    }



    async updateTaskStatus(
        id: number,
        status: TaskStatus,
        user: User,
    ): Promise<Task> {
        const taskToFind = await this.getTaskById(id, user);

        taskToFind.status = status;
        await taskToFind.save();

        return taskToFind;
    }
}
