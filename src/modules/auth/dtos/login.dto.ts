import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { PATTERN_VALIDATION, InvalidCredentialException } from 'src/common';

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
