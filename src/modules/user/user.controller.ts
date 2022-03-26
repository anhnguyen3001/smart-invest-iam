import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetUserId } from 'src/common';
import { User } from 'src/entities';
import { ChangePasswordDto, UpdateUserDto } from './dto';
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
    type: User,
    description: 'Get user info successfully',
  })
  async getUserInfo(@GetUserId() id: number): Promise<User> {
    return this.userService.findOneById(id);
  }

  @Patch('update-info')
  @ApiOperation({
    summary: 'Update user info',
  })
  @ApiOkResponse({ type: User, description: 'Update user info successfully' })
  async updateInfo(
    @GetUserId() id: number,
    @Body() dto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.update(id, dto);
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
