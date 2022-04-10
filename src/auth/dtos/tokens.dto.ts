import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class TokenDto {
  @ApiProperty({ type: 'string' })
  @Expose()
  accessToken: string;

  @ApiProperty({ type: 'string' })
  @Expose()
  refreshToken: string;
}
