import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MailModule } from 'external/mail';
import { OtpModule } from 'otp/otp.module';
import { RoleModule } from 'role/role.module';
import { UserModule } from 'user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { FacebookStrategy } from './strategies/facebook.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { JwtStrategy } from './strategies/rt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({}),
    UserModule,
    MailModule,
    OtpModule,
    RoleModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, FacebookStrategy, GoogleStrategy],
})
export class AuthModule {}
