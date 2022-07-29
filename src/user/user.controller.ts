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
import { ApiCode } from 'src/common/constants/apiCode';
import { ApiUpsert } from 'src/common/decorators/request.decorator';
import { ApiOkBaseResponse } from 'src/common/decorators/response.decorator';
import { Identity, RequestParamId, UpsertQueryDto } from 'src/common/dto';
import { transformDtoWithoutGlobalPipe } from 'src/common/pipe';
import { BaseResponse } from 'src/common/types/api-response.type';
import { getBaseResponse } from 'src/common/utils/response';
import { configService } from 'src/config/config.service';
import { User } from 'src/storage/entities/user.entity';
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

  @Get()
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

  @Post()
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
    let user: User;
    const isUpdate = !!upsertQueryDto.id;

    if (isUpdate) {
      // Update user
      const dto = await transformDtoWithoutGlobalPipe(upsertDto, UpdateUserDto);

      user = await this.userService.updateUser(upsertQueryDto.id, dto);
    } else {
      // Create user
      const dto = await transformDtoWithoutGlobalPipe(upsertDto, CreateUserDto);

      user = await this.userService.createUser(dto);
    }

    const responseCodeAndMsg = isUpdate
      ? ApiCode[200].UPDATE_SUCCESS
      : ApiCode[201].CREATE_SUCCESS;

    return getBaseResponse(
      {
        data: {
          id: user.id,
        },
        code: responseCodeAndMsg.code,
        message: responseCodeAndMsg.description,
      },
      Identity,
    );
  }

  @Delete('/:id')
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
