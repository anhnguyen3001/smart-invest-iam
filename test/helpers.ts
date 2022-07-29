import { INestApplication, Injectable } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { AppModule } from 'src/app.module';
import { configService } from 'src/config/config.service';
import { configNestApp } from 'src/config/nest-app.config';
import { TypeOrmConfigService } from 'src/storage/mysql.service';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export async function createTestingApplication(): Promise<INestApplication> {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider(TypeOrmConfigService)
    .useClass(TestingTypeOrmConfigService)
    .compile();

  const app = moduleFixture.createNestApplication();

  configNestApp(app);

  return app;
}

@Injectable()
class TestingTypeOrmConfigService implements TypeOrmOptionsFactory {
  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: configService.getValue('TYPEORM_CONNECTION') as any,
      host: configService.getValue('TYPEORM_HOST'),
      port: parseInt(configService.getValue('TYPEORM_PORT')),
      username: configService.getValue('TYPEORM_USERNAME'),
      password: configService.getValue('TYPEORM_PASSWORD'),
      database: 'smart_invest_test',
      namingStrategy: new SnakeNamingStrategy(),
      autoLoadEntities: true,
      dropSchema: true,
      synchronize: true,
      keepConnectionAlive: true,
    };
  }
}
