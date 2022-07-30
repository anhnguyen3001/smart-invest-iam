import { ApiProperty } from '@nestjs/swagger';
import { OtpTypeEnum } from 'src/storage/entities/otp.entity';

export class SendOtpDto {
  @ApiProperty({ type: 'string' })
  email: string;

  @ApiProperty({ enum: OtpTypeEnum })
  type: OtpTypeEnum;
}
