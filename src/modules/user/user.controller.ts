import {
  Body,
  Controller,
  Get,
  HttpCode,
  Patch,
  Post,
  Query,
  Redirect,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { getBaseResponse, GetUserId, IResponse, Public } from 'src/common';
import { configService } from 'src/config';
import {
  ChangePasswordDto,
  ResultUserDto,
  UpdateUserDto,
  ValidateUserQueryDto,
} from './dto';
import { UserService } from './user.service';

@ApiTags('User')
@Controller({
  path: '/user',
  version: '1',
})
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/me')
  @ApiOperation({
    summary: 'Get user info',
  })
  async getUserInfo(@GetUserId() id: number): Promise<IResponse> {
    const user = await this.userService.findOneById(id);

    return getBaseResponse({ data: { user } }, ResultUserDto);
  }

  @Patch('/update-info')
  @ApiOperation({
    summary: 'Update user info',
  })
  async updateInfo(
    @GetUserId() id: number,
    @Body() dto: UpdateUserDto,
  ): Promise<IResponse> {
    const user = await this.userService.update(id, dto);

    return getBaseResponse({ data: { user } }, ResultUserDto);
  }

  @Post('/change-password')
  @ApiOperation({
    summary: 'Change password',
  })
  @HttpCode(200)
  async changePassword(
    @GetUserId() id: number,
    @Body() dto: ChangePasswordDto,
  ): Promise<void> {
    await this.userService.changePassword(id, dto);
  }

  @Public()
  @Get('/validate')
  @ApiOperation({
    summary: 'Validate user email',
  })
  @Redirect(configService.getValue('CLIENT_DOMAIN'), 301)
  async validateEmail(@Query() query: ValidateUserQueryDto): Promise<void> {
    await this.userService.validateEmail(query);
  }
}
