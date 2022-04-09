import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { StorageModule } from 'storage/storage.module';
import { MailTokenService } from './mail-token.service';

@Module({
  imports: [JwtModule.register({}), StorageModule.getMySQLModule()],
  providers: [MailTokenService],
  exports: [MailTokenService],
})
export class MailTokenModule {}
