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
  CreateRouteDto,
  SearchRouteDto,
  SearchRoutesResponse,
  UpdateRouteDto,
} from './route.dto';
import { RouteService } from './route.service';

@ApiTags('Route')
@Controller({
  path: 'routes',
  version: configService.getValue('API_VERSION'),
})
export class RouteController {
  constructor(private readonly routeService: RouteService) {}

  @Get()
  @ApiOperation({
    summary: 'Get routes by queries',
  })
  @ApiOkBaseResponse(SearchRoutesResponse, {
    description: 'Get routes by queries successfully',
  })
  async getListRoutes(
    @Query() dto: SearchRouteDto,
  ): Promise<BaseResponse<SearchRoutesResponse>> {
    const data = await this.routeService.getListRoutes(dto);
    return getBaseResponse(
      {
        data,
      },
      SearchRoutesResponse,
    );
  }

  @Post()
  @HttpCode(200)
  @ApiOperation({
    summary: 'Upsert route',
  })
  @ApiUpsert(CreateRouteDto, UpdateRouteDto)
  @ApiOkBaseResponse(Identity, {
    description: 'Upsert route successfully',
  })
  async upsertRoute(
    @Body() upsertDto: unknown,
    @Query() upsertQueryDto: UpsertQueryDto,
  ): Promise<BaseResponse<Identity>> {
    if (!!upsertQueryDto.id) {
      // Update role
      const dto = await transformDtoWithoutGlobalPipe(
        upsertDto,
        UpdateRouteDto,
      );

      const role = await this.routeService.updateRoute(upsertQueryDto.id, dto);
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
    const dto = await transformDtoWithoutGlobalPipe(upsertDto, CreateRouteDto);

    const role = await this.routeService.createRoute(dto);
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
    summary: 'Delete route by id',
  })
  @ApiResponse({
    status: 204,
    description: 'Delete route successfully',
  })
  async deleteRoute(@Param() params: RequestParamId): Promise<void> {
    await this.routeService.deleteRoute(params.id);
  }
}
