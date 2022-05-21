import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as bodyParser from 'body-parser';
import { GlobalExceptionsFilter } from 'common/exceptions';
import { DEFAULT_VALIDATION_PIPE } from 'common/pipe';

export const configNestApp = (app: INestApplication) => {
  app.use(bodyParser.json({ limit: '10mb' }));

  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.enableVersioning();
  app.useGlobalPipes(new ValidationPipe(DEFAULT_VALIDATION_PIPE));
  app.useGlobalFilters(new GlobalExceptionsFilter());
};
