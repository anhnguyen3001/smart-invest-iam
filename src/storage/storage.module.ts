import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Otp } from './entities/otp.entity';
import { Permission } from './entities/permission.entity';
import { Role } from './entities/role.entity';
import { Route } from './entities/route.entity';
import { User } from './entities/user.entity';
import { TypeOrmConfigService } from './mysql.service';

@Module({})
export class StorageModule {
  static forRootAsync(): DynamicModule {
    return {
      module: StorageModule,
      imports: [TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService })],
    };
  }

  static getMySQLModule(): DynamicModule {
    return TypeOrmModule.forFeature([User, Otp, Role, Permission, Route]);
  }
}
