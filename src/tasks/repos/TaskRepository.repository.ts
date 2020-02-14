import {EntityRepository, Repository} from "typeorm";
import {Task} from "../domain/Task.entity";
import {CreateTaskDto} from "../dto/create-task.dto";
import {TaskStatus} from "../enums/TaskStatus.enum";
import {GetTasksFilterDto} from "../dto/get-tasks-filter.dto";
import {User} from "../../auth/domain/user.entity";
import {InternalServerErrorException, Logger} from "@nestjs/common";

@EntityRepository(Task)
export class TaskRepository extends Repository<Task>{
    private logger = new Logger('TaskRepository logger');



    async getTasks(
        filterDto: GetTasksFilterDto,
        user: User
    ): Promise<Task[]> {
        const {status, search} = filterDto;
        const queryForTaskTable = this.createQueryBuilder('task');                          // Postgres Query.



        queryForTaskTable.where('task.userId = :userId',
            {userId: user.id});    // I want all tasks of specified user.

        if (status) {
            queryForTaskTable.andWhere('task.status = :status', {status});      // Optional filter condition.

        }

        if (search) {
            queryForTaskTable.andWhere('(task.title LIKE :search OR task.description LIKE :search)',
                {search: `%${search}%`});                  // CAN ASK. // Optional filter condition.
        }

        try {
            const allTasks = await queryForTaskTable.getMany();
            return allTasks;
        } catch (e) {
                this.logger.error(`Failed to get tasks or user ${user.username}, DTO: ${JSON.stringify(filterDto)}`, e.stack);   // Logs
            throw new InternalServerErrorException();
        }
        
    }



    async createTask(
        createTaskDto: CreateTaskDto,
        user: User                      // Who does create the task.
    ): Promise<Task> {
        const {title, description} = createTaskDto;

        const task = new Task();
        task.title = title;
        task.description = description;
        task.status = TaskStatus.OPEN;
        task.user = user;               // Assigning the owner of the future task.
        await task.save();

        delete task.user;               // Deleting user information from the response but not from the instance.
        return task;
    }
}