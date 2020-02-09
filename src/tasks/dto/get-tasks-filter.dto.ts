import {IsIn, IsNotEmpty, IsOptional} from "class-validator";
import {TaskStatus} from "../enums/TaskStatus.enum";

export class GetTasksFilterDto {
    @IsOptional()
    @IsIn([TaskStatus.OPEN, TaskStatus.DONE, TaskStatus.IN_PROGRESS])
    status: string;

    @IsOptional()
    @IsNotEmpty()
    search: string;
}