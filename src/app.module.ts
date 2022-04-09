import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from 'auth/auth.module';
import { AtGuard } from 'common/guards/at.guard';
import { MailModule } from 'external/mail';
import { OtpModule } from 'otp/otp.module';
import { UserModule } from 'user/user.module';
import { StorageModule } from './storage/storage.module';

@Module({
  imports: [
    StorageModule.forRootAsync(),
    AuthModule,
    UserModule,
    MailModule,
    OtpModule,
  ],
  controllers: [],
  providers: [{ provide: APP_GUARD, useClass: AtGuard }],
})
export class AppModule {}
