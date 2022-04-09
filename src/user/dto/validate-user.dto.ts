import { IsString, Matches } from 'class-validator';
import { PATTERN_VALIDATION } from 'common/constants/validation';

export class ValidateUserQueryDto {
  @IsString()
  @Matches(PATTERN_VALIDATION.email)
  email: string;

  @IsString()
  token: string;
}
