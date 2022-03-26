import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { PATTERN_VALIDATION } from 'src/common';
import { PasswordNotMatchException } from 'src/modules/user/user.exception';

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

  validate() {
    if (this.password !== this.confirmPassword) {
      throw new PasswordNotMatchException();
    }
  }
}
