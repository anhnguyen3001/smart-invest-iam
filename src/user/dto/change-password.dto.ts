import { ApiProperty } from '@nestjs/swagger';
import { Matches } from 'class-validator';
import { PATTERN_VALIDATION } from 'common/constants/validation';
import { PasswordNotMatchException } from '../user.exception';

export class ChangePasswordDto {
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
