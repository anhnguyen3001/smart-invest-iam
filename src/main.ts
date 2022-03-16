import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configNestApp, configService, configSwagger } from './common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  configNestApp(app);
  configSwagger(app);

  await app.listen(configService.getPort() || 3000);
}
bootstrap();
