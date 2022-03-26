import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';
import { PATTERN_VALIDATION } from 'src/common';

export class VerifyUserQueryDto {
  @ApiProperty({ type: 'string' })
  @IsString()
  @Matches(PATTERN_VALIDATION.email)
  email: string;

  @ApiProperty({ type: 'string' })
  @IsString()
  token: string;
}
