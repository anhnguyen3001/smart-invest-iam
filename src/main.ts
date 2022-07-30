import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { configService } from 'src/config/config.service';
import { configNestApp } from 'src/config/nest-app.config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  configNestApp(app);

  // Swagger
  const options = new DocumentBuilder()
    .setTitle('Smart Invest IAM')
    .setDescription('Smart Invest IAM API')
    .setVersion('1.0.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      in: 'header',
      name: 'Authorization',
    })
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('v1/docs', app, document);

  await app.listen(configService.getPort() || 3000);
}
bootstrap();
