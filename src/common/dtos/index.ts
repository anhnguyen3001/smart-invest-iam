import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';
import { EntitySchema } from 'typeorm';

export class BaseResponse<T> {
  @Expose()
  @ApiResponseProperty({ type: 'string' })
  code: string;

  @Expose()
  @ApiResponseProperty({ type: 'string' })
  message: string;

  @Expose()
  @ApiResponseProperty()
  data: T;
}

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

export class UpsertActionBy {
  @IsOptional()
  actionBy: string;
}
