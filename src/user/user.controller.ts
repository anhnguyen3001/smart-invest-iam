import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ApiOkBaseResponse } from 'common/decorators/api-base-response.decorator';
import { GetUserId } from 'common/decorators/get-user.decorator';
import { BaseResponse } from 'common/types/api-response.type';
import { getBaseResponse } from 'common/utils/response';
import { configService } from 'config/config.service';
import { User } from 'storage/entities/user.entity';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateInfoDto } from './dto/update-info.dto';
import { UserService } from './user.service';

@ApiBearerAuth()
@ApiTags('User')
@Controller({
  path: 'user',
  version: configService.getValue('API_VERSION'),
})
@ApiExtraModels(BaseResponse, User)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @ApiOperation({
    summary: 'Get user info',
  })
  @ApiOkBaseResponse(User, {
    description: 'Get user info successfully',
  })
  async getUserInfo(@GetUserId() id: number): Promise<BaseResponse<User>> {
    const user = await this.userService.findOneById(id);
    return getBaseResponse(
      {
        data: user,
      },
      User,
    );
  }

  @Patch('me')
  @ApiOperation({
    summary: 'Update user info',
  })
  @ApiNoContentResponse({
    description: 'Update user info successfully',
  })
  async updateInfo(
    @GetUserId() id: number,
    @Body() dto: UpdateInfoDto,
  ): Promise<void> {
    await this.userService.updateProfile(id, dto);
  }

  @Post('change-password')
  @ApiOperation({
    summary: 'Change password',
  })
  @ApiOkResponse({ description: 'Change password successfully' })
  async changePassword(
    @GetUserId() id: number,
    @Body() dto: ChangePasswordDto,
  ): Promise<void> {
    await this.userService.changePassword(id, dto);
  }
}
