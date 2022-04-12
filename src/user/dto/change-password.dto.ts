import { ApiProperty } from '@nestjs/swagger';
import { Matches } from 'class-validator';
import { PATTERN_VALIDATION } from 'common/constants/validation';
import { PasswordNotMatchException } from '../user.exception';

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
