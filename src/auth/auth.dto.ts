import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
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
import { OtpTypeEnum } from 'src/storage/entities/otp.entity';
import { MethodEnum } from 'src/storage/entities/route.entity';
import { validatePassword } from 'src/user/common';
import { IncorrectEmailPasswordException } from './auth.exception';

export class LoginDto {
  @ApiProperty({ type: 'string' })
  @IsString()
  email: string;

  @ApiProperty({ type: 'string' })
  @IsString()
  password: string;

  @ApiProperty({ type: 'string' })
  @IsString()
  path: string;

  @ApiProperty({ enum: MethodEnum })
  @IsString()
  method: MethodEnum;

  validate() {
    if (
      !PATTERN_VALIDATION.email.test(this.email) ||
      !PATTERN_VALIDATION.password.test(this.password)
    ) {
      throw new IncorrectEmailPasswordException();
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
    validatePassword(this.password, this.confirmPassword);
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
  @IsString()
  password: string;

  @ApiProperty({ type: 'string' })
  @Matches(PATTERN_VALIDATION.password)
  @IsString()
  confirmPassword: string;

  validate() {
    validatePassword(this.password, this.confirmPassword);
  }
}
