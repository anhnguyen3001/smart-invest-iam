import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './external/mail';
import { OtpModule } from './otp/otp.module';
import { PermissionModule } from './permission/permission.module';
import { RoleModule } from './role/role.module';
import { RouteModule } from './route/route.module';
import { UserModule } from './user/user.module';
import { StorageModule } from './storage/storage.module';

@Module({
  imports: [
    StorageModule.forRootAsync(),
    AuthModule,
    UserModule,
    MailModule,
    OtpModule,
    RouteModule,
    RoleModule,
    PermissionModule,
  ],
  controllers: [],
})
export class AppModule {}
