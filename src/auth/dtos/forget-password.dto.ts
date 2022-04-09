import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';
import { PATTERN_VALIDATION } from 'common/constants/validation';

export class ForgetPasswordDto {
  @ApiProperty({ type: 'string' })
  @Matches(PATTERN_VALIDATION.email)
  @IsString()
  email: string;
}
