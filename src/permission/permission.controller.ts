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
  ApiParam,
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
  CreatePermissionDto,
  SearchPermissionDto,
  SearchPermissionsResult,
  UpdatePermissionDto,
  UpsertPermissionQueryDto,
} from './permission.dto';
import { PermissionService } from './permission.service';

@ApiBearerAuth()
@ApiTags('Permission')
@Controller({
  path: 'permissions',
  version: configService.getValue('API_VERSION'),
})
@ApiExtraModels(BaseResponse, SearchPermissionsResult, Identity)
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Get()
  @ApiOperation({
    summary: 'Get permissions by queries',
  })
  @ApiOkBaseResponse(SearchPermissionsResult, {
    description: 'Get roles by queries successfully',
  })
  async getListRoles(
    @Query() dto: SearchPermissionDto,
  ): Promise<BaseResponse<SearchPermissionsResult>> {
    const permissions = await this.permissionService.getListPermissions(dto);
    return getBaseResponse(
      {
        data: permissions,
      },
      SearchPermissionsResult,
    );
  }

  @Post()
  @HttpCode(200)
  @ApiOperation({
    summary: 'Upsert permission',
  })
  @ApiParam({
    name: 'permissionId',
    type: 'number',
    required: false,
    description: 'Use for updating permission',
  })
  @ApiOkBaseResponse(Identity, {
    description: 'Upsert permission successfully',
  })
  async upsertPermission(
    @Body() upsertDto: unknown,
    @Query() upsertQueryDto: UpsertPermissionQueryDto,
  ): Promise<BaseResponse<Identity>> {
    if (!!upsertQueryDto.permissionId) {
      // Update role
      const dto = await transformDtoWithoutGlobalPipe(
        upsertDto,
        UpdatePermissionDto,
      );

      const permission = await this.permissionService.updatePermission(
        upsertQueryDto.permissionId,
        dto,
      );
      return getBaseResponse(
        {
          data: {
            id: permission.id,
          },
          code: ApiCode[200].UPDATE_SUCCESS.code,
          message: ApiCode[200].UPDATE_SUCCESS.description,
        },
        Identity,
      );
    }

    // Create permission
    const dto = await transformDtoWithoutGlobalPipe(
      upsertDto,
      CreatePermissionDto,
    );

    const permission = await this.permissionService.createPermission(dto);
    return getBaseResponse(
      {
        data: {
          id: permission.id,
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
    summary: 'Delete permission by id',
  })
  @ApiResponse({
    status: 204,
    description: 'Delete permission successfully',
  })
  async deletePermission(@Param() params: RequestParamId): Promise<void> {
    await this.permissionService.deletePermission(params.id);
  }
}
