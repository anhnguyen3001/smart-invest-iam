import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
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
}

export class Identity {
  @ApiProperty({ type: 'number' })
  @Expose()
  id: number;
}
