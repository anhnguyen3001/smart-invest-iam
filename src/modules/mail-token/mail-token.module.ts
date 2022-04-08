import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailToken } from 'src/entities';
import { MailTokenService } from './mail-token.service';

@Module({
  imports: [JwtModule.register({}), TypeOrmModule.forFeature([MailToken])],
  providers: [MailTokenService],
  exports: [MailTokenService],
})
export class MailTokenModule {}
