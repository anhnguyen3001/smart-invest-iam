import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { configService } from 'config/config.service';
import { configNestApp } from 'config/nest-app.config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  configNestApp(app);

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
