import { Module } from '@nestjs/common';
import { StorageModule } from 'storage/storage.module';
import { PermissionController } from './permission.controller';
import { PermissionService } from './permission.service';

@Module({
  imports: [StorageModule.getMySQLModule()],
  controllers: [PermissionController],
  providers: [PermissionService],
  exports: [PermissionService],
})
export class PermissionModule {}
