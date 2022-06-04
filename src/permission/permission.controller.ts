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
import { ApiUpsert } from 'common/decorators/request.decorator';
import { ApiOkBaseResponse } from 'common/decorators/response.decorator';
import { Identity, RequestParamId, UpsertQueryDto } from 'common/dto';
import { transformDtoWithoutGlobalPipe } from 'common/pipe';
import { BaseResponse } from 'common/types/api-response.type';
import { getBaseResponse } from 'common/utils/response';
import { configService } from 'config/config.service';
import {
  CreatePermissionDto,
  SearchPermissionDto,
  SearchPermissionsResponse,
  UpdatePermissionDto,
} from './permission.dto';
import { PermissionService } from './permission.service';

@ApiBearerAuth()
@ApiTags('Permission')
@Controller({
  path: 'permissions',
  version: configService.getValue('API_VERSION'),
})
@ApiExtraModels(BaseResponse, SearchPermissionsResponse, Identity)
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Get()
  @ApiOperation({
    summary: 'Get permissions by queries',
  })
  @ApiOkBaseResponse(SearchPermissionsResponse, {
    description: 'Get roles by queries successfully',
  })
  async getListRoles(
    @Query() dto: SearchPermissionDto,
  ): Promise<BaseResponse<SearchPermissionsResponse>> {
    const data = await this.permissionService.getListPermissions(dto);
    return getBaseResponse(
      {
        data,
      },
      SearchPermissionsResponse,
    );
  }

  @Post()
  @HttpCode(200)
  @ApiOperation({
    summary: 'Upsert permission',
  })
  @ApiUpsert(CreatePermissionDto, UpdatePermissionDto)
  @ApiOkBaseResponse(Identity, {
    description: 'Upsert permission successfully',
  })
  async upsertPermission(
    @Body() upsertDto: unknown,
    @Query() upsertQueryDto: UpsertQueryDto,
  ): Promise<BaseResponse<Identity>> {
    if (!!upsertQueryDto.id) {
      // Update role
      const dto = await transformDtoWithoutGlobalPipe(
        upsertDto,
        UpdatePermissionDto,
      );

      const permission = await this.permissionService.updatePermission(
        upsertQueryDto.id,
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
