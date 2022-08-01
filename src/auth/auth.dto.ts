import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { PATTERN_VALIDATION } from 'src/common/constants/validation';
import { InvalidCredentialException } from './auth.exception';
import { OtpTypeEnum } from 'src/storage/entities/otp.entity';
import { PasswordNotMatchException } from 'src/user/user.exception';
import { Expose } from 'class-transformer';

export class LoginDto {
  @ApiProperty({ type: 'string' })
  @IsString()
  email: string;

  @ApiProperty({ type: 'string' })
  @IsString()
  password: string;

  validate() {
    if (
      !PATTERN_VALIDATION.email.test(this.email) ||
      !PATTERN_VALIDATION.password.test(this.password)
    ) {
      throw new InvalidCredentialException();
    }
  }
}

export class LoginSocialDto {
  @ApiProperty({ type: 'string' })
  access_token: string;
}

export class TokenResult {
  @ApiProperty({ type: 'string' })
  @Expose()
  accessToken: string;

  @ApiProperty({ type: 'string' })
  @Expose()
  refreshToken: string;
}

export class SignupDto {
  @ApiProperty({ type: 'string' })
  @Matches(PATTERN_VALIDATION.email)
  @IsString()
  email: string;

  @ApiProperty({ type: 'string' })
  @Matches(PATTERN_VALIDATION.password)
  @IsString()
  password: string;

  @ApiProperty({ type: 'string' })
  @Matches(PATTERN_VALIDATION.password)
  @IsString()
  confirmPassword: string;

  @ApiProperty({ type: 'string' })
  @MaxLength(255)
  @MinLength(1)
  @IsString()
  username: string;

  @ApiProperty({ type: 'boolean' })
  @IsBoolean()
  @IsOptional()
  sendVerifiedEmail?: boolean = true;

  @ApiProperty({ type: 'string' })
  @IsString()
  @IsOptional()
  roleCode?: string;

  validate() {
    if (this.password !== this.confirmPassword) {
      throw new PasswordNotMatchException();
    }
  }
}

export class ForgetPasswordDto {
  @ApiProperty({ type: 'string' })
  @Matches(PATTERN_VALIDATION.email)
  @IsString()
  email: string;
}

export class VerifyOtpDto {
  @ApiProperty({ type: 'string' })
  @IsString()
  @Matches(PATTERN_VALIDATION.email)
  email: string;

  @ApiProperty({ type: 'string' })
  @IsString()
  code: string;
}

export class OtpTokenResult {
  @Expose()
  @ApiResponseProperty({ type: 'string' })
  token: string;
}

export class ResendOtpQueryDto {
  @ApiProperty({ type: OtpTypeEnum })
  @IsEnum(OtpTypeEnum)
  type: OtpTypeEnum;

  @ApiProperty({ type: 'string' })
  @Matches(PATTERN_VALIDATION.email)
  @IsString()
  email: string;
}

export class RecoverPasswordDto extends VerifyOtpDto {
  @ApiProperty({ type: 'string' })
  @Matches(PATTERN_VALIDATION.password)
  newPassword: string;

  @ApiProperty({ type: 'string' })
  @Matches(PATTERN_VALIDATION.password)
  confirmPassword: string;

  validate() {
    if (this.newPassword !== this.confirmPassword) {
      throw new PasswordNotMatchException();
    }
  }
}
