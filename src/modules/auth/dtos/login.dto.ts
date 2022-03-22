import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { PATTERN_VALIDATION } from 'src/common';
import { InvalidCredentialException } from '../auth.exception';

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
