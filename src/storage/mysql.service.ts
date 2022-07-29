import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { configService } from 'src/config/config.service';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: configService.getValue('TYPEORM_CONNECTION') as any,
      host: configService.getValue('TYPEORM_HOST'),
      port: parseInt(configService.getValue('TYPEORM_PORT')),
      username: configService.getValue('TYPEORM_USERNAME'),
      password: configService.getValue('TYPEORM_PASSWORD'),
      database: configService.getValue('TYPEORM_DATABASE'),
      migrations: [configService.getValue('TYPEORM_MIGRATIONS')],
      cli: {
        migrationsDir: configService.getValue('TYPEORM_MIGRATIONS_DIR'),
      },
      namingStrategy: new SnakeNamingStrategy(),
      autoLoadEntities: true,
    };
  }
}
