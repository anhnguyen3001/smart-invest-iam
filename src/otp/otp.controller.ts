import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { configService } from 'src/config/config.service';
import { SendOtpDto } from './otp.dto';
import { OtpService } from './otp.service';

@ApiTags('Otp')
@Controller({
  path: 'otps',
  version: configService.getValue('API_VERSION'),
})
export class OtpController {
  constructor(private readonly otpService: OtpService) {}

  @Get()
  @ApiOperation({
    summary: 'Send opt to email successfully',
  })
  async sendOtp(@Query() query: SendOtpDto): Promise<void> {
    await this.otpService.sendOtp(query);
  }
}
