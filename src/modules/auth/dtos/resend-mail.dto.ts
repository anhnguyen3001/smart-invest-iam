import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, Matches } from 'class-validator';
import { PATTERN_VALIDATION } from 'src/common';

export enum MailEnum {
  register = 'register',
  resetPassword = 'resetPassword',
}

export class ResendMailQueryDto {
  @ApiProperty({ type: MailEnum })
  @IsEnum(MailEnum)
  type: MailEnum;

  @ApiProperty({ type: 'string' })
  @Matches(PATTERN_VALIDATION.email)
  @IsString()
  email: string;
}
