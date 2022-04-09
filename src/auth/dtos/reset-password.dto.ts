import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';
import { PATTERN_VALIDATION } from 'common/constants/validation';
import { PasswordNotMatchException } from 'user/user.exception';

export class ResetPasswordQuery {
  @ApiProperty({ type: 'string' })
  @IsString()
  @Matches(PATTERN_VALIDATION.email)
  email: string;

  @ApiProperty({ type: 'string' })
  @IsString()
  token: string;
}

export class ResetPasswordDto {
  @ApiProperty({ type: 'string' })
  @Matches(PATTERN_VALIDATION.password)
  password: string;

  @ApiProperty({ type: 'string' })
  @Matches(PATTERN_VALIDATION.password)
  confirmPassword: string;

  validate() {
    if (this.password !== this.confirmPassword) {
      throw new PasswordNotMatchException();
    }
  }
}
