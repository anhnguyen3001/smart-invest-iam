import { ValidationPipe, ValidationPipeOptions } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';
import { AppModule } from './app.module';
import { AllExceptionsFilter, exceptionFactoryValidationPipe } from './common';
import { configService } from './config';

const DEFAULT_VALIDATION_PIPE: ValidationPipeOptions = {
  transform: true,
  whitelist: true,
  exceptionFactory: exceptionFactoryValidationPipe,
  stopAtFirstError: true,
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(bodyParser.json({ limit: '10mb' }));

  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.enableVersioning();
  app.useGlobalPipes(new ValidationPipe(DEFAULT_VALIDATION_PIPE));
  app.useGlobalFilters(new AllExceptionsFilter());

  // Swagger
  const options = new DocumentBuilder()
    .setTitle('AH Ticker Auth-BFF')
    .setDescription('AH Ticker Auth-BFF API')
    .setVersion('1.0.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', in: 'header' },
      'Authorization',
    )
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(configService.getPort() || 3000);
}
bootstrap();
