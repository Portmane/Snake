import {EntityRepository, Repository} from "typeorm";
import {Task} from "../domain/Task.entity";
import {CreateTaskDto} from "../dto/create-task.dto";
import {TaskStatus} from "../enums/TaskStatus.enum";
import {GetTasksFilterDto} from "../dto/get-tasks-filter.dto";

@EntityRepository(Task)
export class TaskRepository extends Repository<Task>{
    async getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
        const {status, search} = filterDto;
        const queryForTaskTable = this.createQueryBuilder('task');


        if (status) {
            queryForTaskTable.andWhere('task.status = :status', {status});

        }

        if (search) {
            queryForTaskTable.andWhere('(task.title LIKE :search OR task.description LIKE :search)', {search: `%${search}%`});                  // CAN ASK.
        }


        const allTasks = await queryForTaskTable.getMany();
        return allTasks;
    }



    async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
        const {title, description} = createTaskDto;

        const task = new Task();
        task.title = title;
        task.description = description;
        task.status = TaskStatus.OPEN;
        await task.save();

        return task;
    }
}