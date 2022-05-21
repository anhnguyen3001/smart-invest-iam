import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
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
  id: number;
}

export class RequestParamId {
  @IsInt()
  @Type(() => Number)
  id: number;
}

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
}

export class Pagination {
  @ApiProperty({ default: 0 })
  totalItems: number;

  @ApiProperty({ default: 0 })
  totalPages: number;
}
