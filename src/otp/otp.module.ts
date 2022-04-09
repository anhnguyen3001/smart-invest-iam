import { Module } from '@nestjs/common';
import { StorageModule } from 'storage/storage.module';
import { OtpService } from './otp.service';

@Module({
  imports: [StorageModule.getMySQLModule()],
  providers: [OtpService],
  exports: [OtpService],
})
export class OtpModule {}
