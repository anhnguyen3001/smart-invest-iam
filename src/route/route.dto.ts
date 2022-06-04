import { ApiProperty, ApiResponseProperty, PartialType } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  IsEnum,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { BASE_SORT_BY, QueryCoreDto, ResponseWithPagination } from 'common/dto';
import { MethodEnum, Route } from 'storage/entities/route.entity';

const ROUTE_SORT_BY = BASE_SORT_BY;
export class SearchRouteDto extends QueryCoreDto {
  @ApiProperty({ enum: ROUTE_SORT_BY, default: 'id', required: false })
  @IsIn(ROUTE_SORT_BY)
  @IsOptional()
  sortBy?: string = 'id';
}

export class SearchRoutesResponse extends ResponseWithPagination {
  @Expose()
  @ApiResponseProperty({ type: [Route] })
  @Type(() => Route)
  routes: Route[];
}

export class CreateRouteDto {
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  route: string;

  @IsEnum(MethodEnum)
  method: MethodEnum;

  @IsNumber()
  @IsOptional()
  permissionId?: number;
}

export class UpdateRouteDto extends PartialType(CreateRouteDto) {}
