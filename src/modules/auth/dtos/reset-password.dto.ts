import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';
import { PATTERN_VALIDATION } from 'src/common';
import { PasswordNotMatchException } from 'src/modules/user/user.exception';

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
  oldPassword: string;

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
