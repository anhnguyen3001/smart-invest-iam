import { Expose, Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

export class BaseResponse<T> {
  @Expose()
  code: string;

  @Expose()
  message: string;

  @Expose()
  data: T;

  @Expose()
  details: unknown;
}

export class Identity {
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
