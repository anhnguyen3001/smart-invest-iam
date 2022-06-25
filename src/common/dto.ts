import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { ORDER_BY } from './types/core.type';

export class Identity {
  @ApiProperty({ type: 'number' })
  @Expose()
  id: number;
}

export class RequestParamId {
  @IsInt()
  @Type(() => Number)
  id: number;
}

export const BASE_SORT_BY = ['id', 'createdAt', 'updatedAt'];

export class QueryCoreDto {
  @ApiProperty({ type: 'number', required: false })
  @Max(999)
  @Min(1)
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  page?: number = 1;

  @ApiProperty({ type: 'number', required: false })
  @Max(999)
  @Min(1)
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  pageSize?: number = 10;

  @ApiProperty({ type: 'string', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  @MinLength(1)
  q?: string;

  @ApiProperty({ enum: ORDER_BY, default: ORDER_BY.DESC, required: false })
  @IsEnum(ORDER_BY)
  @IsOptional()
  orderBy?: ORDER_BY = ORDER_BY.DESC;

  @ApiProperty({ type: 'boolean', required: false })
  @IsBoolean()
  @IsOptional()
  getAll?: boolean;
}

export class UpsertQueryDto {
  @ApiProperty({ type: 'number', required: false })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  id?: number;
}

export class Pagination {
  @ApiProperty({ default: 0 })
  totalItems: number;

  @ApiProperty({ default: 0 })
  totalPages: number;
}

export class ResponseWithPagination {
  @Expose()
  @ApiProperty({ type: Pagination })
  pagination: Pagination;
}
