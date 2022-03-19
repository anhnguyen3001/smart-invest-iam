import { Expose } from 'class-transformer';
import { IsOptional } from 'class-validator';

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

export class UpsertActionBy {
  @IsOptional()
  actionBy: string;
}
