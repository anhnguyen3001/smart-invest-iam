import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiNoContentResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RtGuard } from 'auth/guards/rt.guard';
import { ApiOkBaseResponse } from 'common/decorators/response.decorator';
import { GetUserId } from 'common/decorators/user.decorator';
import { BaseResponse } from 'common/types/api-response.type';
import { getBaseResponse } from 'common/utils/response';
import { configService } from 'config/config.service';
import {
  ChangePasswordDto,
  UpdateProfileDto,
  UserProfileResponseDto,
} from './user.dto';
import { UserService } from './user.service';

@ApiTags('UserProfile')
@Controller({
  path: 'me',
  version: configService.getValue('API_VERSION'),
})
export class UserProfileController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(RtGuard)
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

  @Patch()
  @ApiOperation({
    summary: 'Update user profile',
  })
  @ApiNoContentResponse({
    description: 'Update user profile successfully',
  })
  async updateProfile(
    @GetUserId() id: number,
    @Body() dto: UpdateProfileDto,
  ): Promise<void> {
    await this.userService.updateUser(id, dto);
  }

  @Post('change-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Change password',
  })
  @ApiNoContentResponse({ description: 'Change password successfully' })
  async changePassword(
    @GetUserId() id: number,
    @Body() dto: ChangePasswordDto,
  ): Promise<void> {
    await this.userService.changePassword(id, dto);
  }
}
