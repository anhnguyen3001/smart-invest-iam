import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { RoleModule } from 'src/role/role.module';
import { StorageModule } from 'src/storage/storage.module';
import { UserProfileController } from './user-profile.controller';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [StorageModule.getMySQLModule(), JwtModule.register({}), RoleModule],
  controllers: [UserController, UserProfileController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
