import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiCode } from 'common/constants/apiCode';
import { ApiUpsert } from 'common/decorators/request.decorator';
import { ApiOkBaseResponse } from 'common/decorators/response.decorator';
import { Identity, RequestParamId, UpsertQueryDto } from 'common/dto';
import { transformDtoWithoutGlobalPipe } from 'common/pipe';
import { BaseResponse } from 'common/types/api-response.type';
import { getBaseResponse } from 'common/utils/response';
import { configService } from 'config/config.service';
import {
  CreateUserDto,
  SearchUserDto,
  SearchUsersResponse,
  UpdateUserDto,
} from './user.dto';
import { UserService } from './user.service';

@ApiTags('User')
@Controller({
  path: 'users',
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
}
