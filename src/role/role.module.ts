import { Module } from '@nestjs/common';
import { StorageModule } from 'storage/storage.module';
import { RoleService } from './role.service';

@Module({
  imports: [StorageModule.getMySQLModule()],
  providers: [RoleService],
  exports: [RoleService],
})
export class RoleModule {}
