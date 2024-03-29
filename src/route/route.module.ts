import { Module } from '@nestjs/common';
import { PermissionModule } from 'src/permission/permission.module';
import { StorageModule } from 'src/storage/storage.module';
import { RouteController } from './route.controller';
import { RouteService } from './route.service';

@Module({
  imports: [StorageModule.getMySQLModule(), PermissionModule],
  controllers: [RouteController],
  providers: [RouteService],
  exports: [RouteService],
})
export class RouteModule {}
