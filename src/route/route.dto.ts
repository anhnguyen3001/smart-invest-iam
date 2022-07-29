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
import {
  BASE_SORT_BY,
  QueryCoreDto,
  ResponseWithPagination,
} from 'src/common/dto';
import { MethodEnum, Route } from 'src/storage/entities/route.entity';

const ROUTE_SORT_BY = [...BASE_SORT_BY, 'name'];
export class SearchRouteDto extends QueryCoreDto {
  @ApiProperty({ enum: ROUTE_SORT_BY, default: 'id', required: false })
  @IsIn(ROUTE_SORT_BY)
  @IsOptional()
  sortBy?: string = 'id';

  @ApiProperty({ type: [Number], required: false })
  @IsNumber({}, { each: true })
  @IsOptional()
  permissionIds?: number[];

  @ApiProperty({ type: 'string', required: false })
  @IsString()
  @IsOptional()
  path?: string;

  @ApiProperty({ enum: MethodEnum, required: false })
  @IsEnum(MethodEnum)
  @IsOptional()
  method?: MethodEnum;
}

export class SearchRoutesResponse extends ResponseWithPagination {
  @Expose()
  @ApiResponseProperty({ type: [Route] })
  @Type(() => Route)
  routes: Route[];
}

export class CreateRouteDto {
  @ApiProperty({ type: 'string' })
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  name: string;

  @ApiProperty({ type: 'string' })
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  regUri: string;

  @ApiProperty({ enum: MethodEnum })
  @IsEnum(MethodEnum)
  method: MethodEnum;

  @ApiProperty({ type: Number, required: false })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  permissionId?: number;
}

export class UpdateRouteDto extends PartialType(CreateRouteDto) {}

export class RouteAccessQueryDto {
  @ApiProperty({ type: 'number' })
  @IsNumber()
  @Type(() => Number)
  userId: number;

  @ApiProperty({ type: 'string' })
  @IsString()
  path: string;

  @ApiProperty({ enum: MethodEnum })
  @IsEnum(MethodEnum)
  method: MethodEnum;
}

export class RouteAccessResponse {
  @Expose()
  @ApiResponseProperty({ type: 'boolean' })
  isAllow: boolean;
}
