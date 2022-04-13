import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { PATTERN_VALIDATION } from 'common/constants/validation';
import { LoginMethodEnum, User } from 'storage/entities/user.entity';
import { PasswordNotMatchException } from './user.exception';

export interface ICreateUser {
  email: string;
  username: string;
  isVerified?: boolean;
  password?: string;
  method?: LoginMethodEnum;
}

export class ValidateUserQueryDto {
  @IsString()
  @Matches(PATTERN_VALIDATION.email)
  email: string;

  @IsString()
  token: string;
}

export class UpdatePasswordDto {
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

export class ChangePasswordDto extends UpdatePasswordDto {
  @ApiProperty({ type: 'string' })
  @Matches(PATTERN_VALIDATION.password)
  oldPassword: string;
}

export class UpdateProfileDto {
  @ApiProperty({ type: 'string' })
  @MaxLength(255)
  @MinLength(1)
  @IsString()
  @IsOptional()
  username?: string;

  @ApiProperty({ type: 'string' })
  @MaxLength(255)
  @MinLength(1)
  @IsString()
  @IsOptional()
  avatar?: string;
}

export class UserResultDto {
  @ApiProperty({ type: User })
  @Type(() => User)
  user: User;
}
