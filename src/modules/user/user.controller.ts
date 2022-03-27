import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { getBaseResponse, GetUserId } from 'src/common';
import { ChangePasswordDto, UpdateUserDto, UserDto } from './dto';
import { UserService } from './user.service';

@ApiTags('User')
@Controller({
  path: 'user',
  version: '1',
})
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @ApiOperation({
    summary: 'Get user info',
  })
  @ApiOkResponse({
    type: UserDto,
    description: 'Get user info successfully',
  })
  async getUserInfo(@GetUserId() id: number): Promise<UserDto> {
    const user = await this.userService.findOneById(id);
    return getBaseResponse(user, UserDto);
  }

  @Patch('update-info')
  @ApiOperation({
    summary: 'Update user info',
  })
  @ApiOkResponse({
    type: UserDto,
    description: 'Update user info successfully',
  })
  async updateInfo(
    @GetUserId() id: number,
    @Body() dto: UpdateUserDto,
  ): Promise<UserDto> {
    const user = this.userService.update(id, dto);
    return getBaseResponse(user, UserDto);
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
