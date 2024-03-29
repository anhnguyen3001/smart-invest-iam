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
import {
  CreateRoleDto,
  SearchRoleDto,
  SearchRolesResponse,
  UpdateRoleDto,
} from './role.dto';
import { RoleService } from './role.service';

@ApiTags('Role')
@Controller({
  path: 'roles',
  version: configService.getValue('API_VERSION'),
})
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  @ApiOperation({
    summary: 'Get roles by queries',
  })
  @ApiOkBaseResponse(SearchRolesResponse, {
    description: 'Get roles by queries successfully',
  })
  async getListRoles(
    @Query() dto: SearchRoleDto,
  ): Promise<BaseResponse<SearchRolesResponse>> {
    const data = await this.roleService.getListRoles(dto);
    return getBaseResponse(
      {
        data,
      },
      SearchRolesResponse,
    );
  }

  @Post()
  @HttpCode(200)
  @ApiOperation({
    summary: 'Upsert role',
  })
  @ApiUpsert(CreateRoleDto, UpdateRoleDto)
  @ApiOkBaseResponse(Identity, {
    description: 'Upsert role successfully',
  })
  async upsertRole(
    @Body() upsertDto: unknown,
    @Query() upsertQueryDto: UpsertQueryDto,
  ): Promise<BaseResponse<Identity>> {
    if (!!upsertQueryDto.id) {
      // Update role
      const dto = await transformDtoWithoutGlobalPipe(upsertDto, UpdateRoleDto);

      const role = await this.roleService.updateRole(upsertQueryDto.id, dto);
      return getBaseResponse(
        {
          data: {
            id: role.id,
          },
          code: ApiCode[200].UPDATE_SUCCESS.code,
          message: ApiCode[200].UPDATE_SUCCESS.description,
        },
        Identity,
      );
    }

    // Create role
    const dto = await transformDtoWithoutGlobalPipe(upsertDto, CreateRoleDto);

    const role = await this.roleService.createRole(dto);
    return getBaseResponse(
      {
        data: {
          id: role.id,
        },
        code: ApiCode[201].CREATE_SUCCESS.code,
        message: ApiCode[201].CREATE_SUCCESS.description,
      },
      Identity,
    );
  }

  @Delete('/:id')
  @HttpCode(204)
  @ApiOperation({
    summary: 'Delete role by id',
  })
  @ApiResponse({
    status: 204,
    description: 'Delete role successfully',
  })
  async deleteRole(@Param() params: RequestParamId): Promise<void> {
    await this.roleService.deleteRole(params.id);
  }
}
