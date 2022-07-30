import { Module } from '@nestjs/common';
import { MailModule } from 'src/external/mail';
import { StorageModule } from 'src/storage/storage.module';
import { UserModule } from 'src/user/user.module';
import { OtpController } from './otp.controller';
import { OtpService } from './otp.service';

@Module({
  imports: [StorageModule.getMySQLModule(), MailModule, UserModule],
  controllers: [OtpController],
  providers: [OtpService],
  exports: [OtpService],
})
export class OtpModule {}
