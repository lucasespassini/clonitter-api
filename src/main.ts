import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { dataSource } from './modules/config/typeorm.config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  const logger = new Logger('NestApp');

  dataSource
    .initialize()
    .then(() => {
      logger.log('Banco conectado!');
    })
    .catch((error) => logger.log(error));

  app.enableCors();
  await app.listen(process.env.PORT || 3000, '0.0.0.0');
}
bootstrap();
