import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { StorageModule } from 'storage/storage.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [StorageModule.getMySQLModule(), JwtModule.register({})],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
