import { ApiResponseProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

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

  @Expose()
  @ApiResponseProperty()
  details?: object;
}
