import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiNoContentResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ApiOkBaseResponse } from 'common/decorators/api-base-response.decorator';
import { GetUserId } from 'common/decorators/get-user.decorator';
import { BaseResponse } from 'common/types/api-response.type';
import { getBaseResponse } from 'common/utils/response';
import { configService } from 'config/config.service';
import { ChangePasswordDto, UpdateProfileDto, UserResultDto } from './user.dto';
import { UserService } from './user.service';

@ApiBearerAuth()
@ApiTags('User')
@Controller({
  path: 'user',
  version: configService.getValue('API_VERSION'),
})
@ApiExtraModels(BaseResponse, UserResultDto)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @ApiOperation({
    summary: 'Get user info',
  })
  @ApiOkBaseResponse(UserResultDto, {
    description: 'Get user info successfully',
  })
  async getUserInfo(
    @GetUserId() id: number,
  ): Promise<BaseResponse<UserResultDto>> {
    const user = await this.userService.findOneById(id);
    return getBaseResponse(
      {
        data: { user },
      },
      UserResultDto,
    );
  }

  @Patch('me')
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
    await this.userService.update(id, dto);
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
