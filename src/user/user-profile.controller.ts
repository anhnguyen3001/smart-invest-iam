import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AtGuard } from 'src/auth/guards/at.guard';
import { ApiOkBaseResponse } from 'src/common/decorators/response.decorator';
import { BaseResponse } from 'src/common/types/api-response.type';
import { getBaseResponse } from 'src/common/utils/response';
import { configService } from 'src/config/config.service';
import { ChangePasswordDto, UserProfileResponseDto } from './user.dto';
import { UserService } from './user.service';

@ApiTags('UserProfile')
@Controller({
  path: 'me',
  version: configService.getValue('API_VERSION'),
})
export class UserProfileController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AtGuard)
  @Get()
  @ApiOperation({
    summary: 'Get user info',
  })
  @ApiOkBaseResponse(UserProfileResponseDto, {
    description: 'Get user info successfully',
  })
  async getUserInfo(
    @Request() request,
  ): Promise<BaseResponse<UserProfileResponseDto>> {
    return getBaseResponse(
      {
        data: { user: request.user },
      },
      UserProfileResponseDto,
    );
  }

  @Post('/change-password')
  @ApiOperation({
    summary: 'Change password of loggedin',
  })
  @ApiOkBaseResponse(UserProfileResponseDto, {
    description: 'Change password of loggedin successfully',
  })
  async changePassword(@Body() data: ChangePasswordDto): Promise<void> {
    await this.userService.changePassword(data);
  }
}
