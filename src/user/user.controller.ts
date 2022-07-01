import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiNoContentResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApiCode } from 'common/constants/apiCode';
import { ApiUpsert } from 'common/decorators/request.decorator';
import { ApiOkBaseResponse } from 'common/decorators/response.decorator';
import { GetUserId } from 'common/decorators/user.decorator';
import { Identity, RequestParamId, UpsertQueryDto } from 'common/dto';
import { transformDtoWithoutGlobalPipe } from 'common/pipe';
import { BaseResponse } from 'common/types/api-response.type';
import { getBaseResponse } from 'common/utils/response';
import { configService } from 'config/config.service';
import {
  ChangePasswordDto,
  CreateUserDto,
  SearchUserDto,
  SearchUsersResponse,
  UpdateProfileDto,
  UpdateUserDto,
  UserProfileResponseDto,
} from './user.dto';
import { UserService } from './user.service';

@ApiTags('User')
@Controller({
  path: [],
  version: configService.getValue('API_VERSION'),
})
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/users')
  @ApiOperation({
    summary: 'Get users by queries',
  })
  @ApiOkBaseResponse(SearchUsersResponse, {
    description: 'Get users by queries successfully',
  })
  async getListRoutes(
    @Query() dto: SearchUserDto,
  ): Promise<BaseResponse<SearchUsersResponse>> {
    const data = await this.userService.getListUsers(dto);
    return getBaseResponse(
      {
        data,
      },
      SearchUsersResponse,
    );
  }

  @Post('/users')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Upsert user',
  })
  @ApiUpsert(CreateUserDto, UpdateUserDto)
  @ApiOkBaseResponse(Identity, {
    description: 'Upsert user successfully',
  })
  async upsertUser(
    @Body() upsertDto: unknown,
    @Query() upsertQueryDto: UpsertQueryDto,
  ): Promise<BaseResponse<Identity>> {
    if (upsertQueryDto.id) {
      // Update user
      const dto = await transformDtoWithoutGlobalPipe(upsertDto, UpdateUserDto);

      const user = await this.userService.updateUser(upsertQueryDto.id, dto);
      return getBaseResponse(
        {
          data: {
            id: user.id,
          },
          code: ApiCode[200].UPDATE_SUCCESS.code,
          message: ApiCode[200].UPDATE_SUCCESS.description,
        },
        Identity,
      );
    }

    // Create user
    const dto = await transformDtoWithoutGlobalPipe(upsertDto, CreateUserDto);

    const user = await this.userService.createUser(dto);
    return getBaseResponse(
      {
        data: {
          id: user.id,
        },
        code: ApiCode[201].CREATE_SUCCESS.code,
        message: ApiCode[201].CREATE_SUCCESS.description,
      },
      Identity,
    );
  }

  @Delete('/users/:id')
  @HttpCode(204)
  @ApiOperation({
    summary: 'Delete user by id',
  })
  @ApiResponse({
    status: 204,
    description: 'Delete user successfully',
  })
  async deleteRoute(@Param() params: RequestParamId): Promise<void> {
    await this.userService.deleteUser(params.id);
  }

  @Get('me')
  @ApiOperation({
    summary: 'Get user info',
  })
  @ApiOkBaseResponse(UserProfileResponseDto, {
    description: 'Get user info successfully',
  })
  async getUserInfo(): Promise<BaseResponse<UserProfileResponseDto>> {
    const user = await this.userService.getUserInfo(3);
    return getBaseResponse(
      {
        data: { user },
      },
      UserProfileResponseDto,
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
