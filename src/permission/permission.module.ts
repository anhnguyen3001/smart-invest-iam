import { Module } from '@nestjs/common';
import { StorageModule } from 'storage/storage.module';
import { PermissionService } from './permission.service';

@Module({
  imports: [StorageModule.getMySQLModule()],
  providers: [PermissionService],
  exports: [PermissionService],
})
export class PermissionModule {}
