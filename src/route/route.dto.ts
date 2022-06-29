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
import { User } from 'storage/entities/user.entity';

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

  @ApiProperty({ enum: MethodEnum })
  @IsEnum(MethodEnum)
  method: MethodEnum;

  @ApiProperty({ type: Number, required: false })
  @IsNumber()
  @IsOptional()
  permissionId?: number;
}

export class UpdateRouteDto extends PartialType(CreateRouteDto) {}

export class RouteAccessQueryDto {
  @ApiProperty({ type: 'number' })
  @IsNumber()
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
  @ApiResponseProperty({ type: User })
  user: User;
}
