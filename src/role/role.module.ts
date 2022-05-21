import { forwardRef, Module } from '@nestjs/common';
import { PermissionModule } from 'permission/permission.module';
import { StorageModule } from 'storage/storage.module';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';

@Module({
  imports: [StorageModule.getMySQLModule(), PermissionModule],
  controllers: [RoleController],
  providers: [RoleService],
  exports: [RoleService],
})
export class RoleModule {}
