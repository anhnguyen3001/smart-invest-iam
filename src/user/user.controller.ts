import { Body, Controller, Patch, Post } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ApiOkBaseResponse } from 'common/decorators/api-base-response.decorator';
import { GetUserId } from 'common/decorators/get-user-id.decorator';
import { Public } from 'common/decorators/public.decorator';
import { BaseResponse } from 'common/types/api-response.type';
import { getBaseResponse } from 'common/utils';
import { User } from 'storage/entities/user.entity';
import { ChangePasswordDto, GetUserDto, UpdateUserDto, UserDto } from './dto';
import { UserService } from './user.service';

@ApiTags('User')
@Controller({
  path: 'user',
  version: '1',
})
@ApiExtraModels(BaseResponse, UserDto, User)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post('me')
  @ApiOperation({
    summary: 'Get user info',
  })
  @ApiOkBaseResponse(User, {
    description: 'Get user info successfully',
  })
  async getUserInfo(@Body() dto: GetUserDto): Promise<BaseResponse<User>> {
    // const user = await this.userService.findOneById(id);
    const user = await this.userService.findOneByLocalEmail(dto.email);
    return getBaseResponse(
      {
        data: user,
      },
      User,
    );
  }

  @Patch('update-info')
  @ApiOperation({
    summary: 'Update user info',
  })
  @ApiOkBaseResponse(UserDto, {
    description: 'Update user info successfully',
  })
  async updateInfo(
    @GetUserId() id: number,
    @Body() dto: UpdateUserDto,
  ): Promise<BaseResponse<UserDto>> {
    const user = await this.userService.update(id, dto);
    return getBaseResponse({ data: user }, UserDto);
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
