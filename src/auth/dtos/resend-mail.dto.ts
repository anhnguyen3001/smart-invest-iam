import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, Matches } from 'class-validator';
import { PATTERN_VALIDATION } from 'common/constants/validation';
import { OtpTypeEnum } from 'storage/entities/otp.entity';

export class ResendMailQueryDto {
  @ApiProperty({ type: OtpTypeEnum })
  @IsEnum(OtpTypeEnum)
  type: OtpTypeEnum;

  @ApiProperty({ type: 'string' })
  @Matches(PATTERN_VALIDATION.email)
  @IsString()
  email: string;
}
