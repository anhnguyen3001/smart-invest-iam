import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configService, configNestApp } from './config';
import { configSwagger } from './common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  configNestApp(app);
  configSwagger(app);

  await app.listen(configService.getPort() || 3000);
}
bootstrap();
