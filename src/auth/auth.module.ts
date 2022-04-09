import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MailModule } from 'external/mail';
import { OtpModule } from 'otp/otp.module';
import { UserModule } from 'user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { FacebookStrategy, GoogleStrategy, JwtStrategy } from './strategies';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({}),
    UserModule,
    MailModule,
    OtpModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, FacebookStrategy, GoogleStrategy],
})
export class AuthModule {}
