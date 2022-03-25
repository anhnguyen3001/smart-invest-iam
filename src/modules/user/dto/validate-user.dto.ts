import { IsString, Matches } from 'class-validator';
import { PATTERN_VALIDATION } from 'src/common';

export class ValidateUserQueryDto {
  @IsString()
  @Matches(PATTERN_VALIDATION.email)
  email: string;

  @IsString()
  token: string;
}