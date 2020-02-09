import {TypeOrmModuleOptions} from "@nestjs/typeorm";
import {Task} from "../tasks/domain/Task.entity";
import {User} from "../auth/domain/user.entity";

export const typeOrmConfig: TypeOrmModuleOptions = {
    type: "postgres",
    host: "localhost",
    port: 1234,

    username: "postgres",
    password: "Yf`,",

    database: "snake",
    entities: [__dirname + "/../**/*.entity.ts", Task, User],
    synchronize: true,
};