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
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApiCode } from 'common/constants/apiCode';
import { ApiOkBaseResponse } from 'common/decorators/api-base-response.decorator';
import { Identity, RequestParamId } from 'common/dto';
import { transformDtoWithoutGlobalPipe } from 'common/pipe';
import { BaseResponse } from 'common/types/api-response.type';
import { getBaseResponse } from 'common/utils/response';
import { configService } from 'config/config.service';
import {
  CreateRoleDto,
  SearchRoleDto,
  SearchRolesResult,
  UpdateRoleDto,
  UpsertRoleQueryDto,
} from './role.dto';
import { RoleService } from './role.service';

@ApiBearerAuth()
@ApiTags('Role')
@Controller({
  path: 'roles',
  version: configService.getValue('API_VERSION'),
})
@ApiExtraModels(BaseResponse, SearchRolesResult, Identity)
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  @ApiOperation({
    summary: 'Get roles by queries',
  })
  @ApiOkBaseResponse(SearchRolesResult, {
    description: 'Get roles by queries successfully',
  })
  async getListRoles(@Query() dto: SearchRoleDto): Promise<SearchRolesResult> {
    return this.roleService.getListRoles(dto);
  }

  @Post()
  @HttpCode(200)
  @ApiOperation({
    summary: 'Upsert role',
  })
  @ApiOkBaseResponse(Identity, {
    description: 'Upsert role successfully',
  })
  async upsertRole(
    @Body() upsertDto: unknown,
    @Query() upsertQueryDto: UpsertRoleQueryDto,
  ): Promise<BaseResponse<Identity>> {
    if (!!upsertQueryDto.roleId) {
      // Update role
      const dto = await transformDtoWithoutGlobalPipe(upsertDto, UpdateRoleDto);

      const category = await this.roleService.updateRole(
        upsertQueryDto.roleId,
        dto,
      );
      return getBaseResponse(
        {
          data: {
            id: category.id,
          },
          code: ApiCode[200].UPDATE_SUCCESS.code,
          message: ApiCode[200].UPDATE_SUCCESS.description,
        },
        Identity,
      );
    }

    // Create role
    const dto = await transformDtoWithoutGlobalPipe(upsertDto, CreateRoleDto);

    const category = await this.roleService.createRole(dto);
    return getBaseResponse(
      {
        data: {
          id: category.id,
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
  async deleteOneCategory(@Param() params: RequestParamId): Promise<void> {
    await this.roleService.deleteRole(params.id);
  }
}
