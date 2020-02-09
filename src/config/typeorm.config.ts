import {TypeOrmModuleOptions} from "@nestjs/typeorm";
import {Task} from "../tasks/domain/Task.entity";
import {User} from "../auth/domain/user.entity";

export const typeOrmConfig: TypeOrmModuleOptions = {
    type: "postgres",
    host: "localhost",
    port: "your port",

    username: "your username",
    password: "your password",

    database: "snake",
    entities: [__dirname + "/../**/*.entity.ts", Task, User],
    synchronize: true,
};