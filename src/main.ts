import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {Logger} from "@nestjs/common";
import * as config from 'config';

async function bootstrap() {
  const serverConfiguration = config.get('server');
  const logger = new Logger("Bootstrap logger");



  const port = process.env.PORT || serverConfiguration.port;      // ASK
  const app = await NestFactory.create(AppModule);
  await app.listen(port);

    logger.log(`Application listening on port ${port}`);  // Logs
}
bootstrap();
