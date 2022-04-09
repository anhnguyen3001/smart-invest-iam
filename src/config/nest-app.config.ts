import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as bodyParser from 'body-parser';
import { GlobalExceptionsFilter } from 'common/exceptions';
import { exceptionFactoryValidationPipe } from 'common/utils/exception';

export const configNestApp = (app: INestApplication) => {
  app.use(bodyParser.json({ limit: '10mb' }));

  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.enableVersioning();
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      exceptionFactory: exceptionFactoryValidationPipe,
      stopAtFirstError: true,
    }),
  );
  app.useGlobalFilters(new GlobalExceptionsFilter());
};
