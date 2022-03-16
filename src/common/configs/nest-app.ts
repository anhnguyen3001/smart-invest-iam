import {
  INestApplication,
  ValidationPipe,
  ValidationPipeOptions,
} from '@nestjs/common';
import * as bodyParser from 'body-parser';
import { AllExceptionsFilter } from '../filters';
import { exceptionFactoryValidationPipe } from '../pipes';

const DEFAULT_VALIDATION_PIPE: ValidationPipeOptions = {
  transform: true,
  whitelist: true,
  exceptionFactory: exceptionFactoryValidationPipe,
  stopAtFirstError: true,
};

export const configNestApp = (app: INestApplication): void => {
  app.use(bodyParser.json({ limit: '10mb' }));

  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.enableVersioning();
  app.useGlobalPipes(new ValidationPipe(DEFAULT_VALIDATION_PIPE));
  app.useGlobalFilters(new AllExceptionsFilter());
};
