import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from 'auth/auth.module';
import { AppGuard } from 'common/guards/app.guard';
import { MailModule } from 'external/mail';
import { OtpModule } from 'otp/otp.module';
import { RouteModule } from 'route/route.module';
import { UserModule } from 'user/user.module';
import { RoleModule } from 'role/role.module';
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
  ],
  controllers: [],
  providers: [{ provide: APP_GUARD, useClass: AppGuard }],
})
export class AppModule {}
