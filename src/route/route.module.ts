import { Module } from '@nestjs/common';
import { StorageModule } from 'storage/storage.module';
import { RouteService } from './route.service';

@Module({
  imports: [StorageModule.getMySQLModule()],
  providers: [RouteService],
  exports: [RouteService],
})
export class RouteModule {}
