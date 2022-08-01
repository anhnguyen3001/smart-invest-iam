import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { OtpTypeEnum } from 'src/storage/entities/otp.entity';

export class SendOtpDto {
  @ApiProperty({ type: 'string' })
  @IsString()
  email: string;

  @ApiProperty({ enum: OtpTypeEnum })
  @IsEnum(OtpTypeEnum)
  type: OtpTypeEnum;
}
