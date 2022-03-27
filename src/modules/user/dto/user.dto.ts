import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class UserDto {
  @Expose()
  @ApiProperty({ type: 'string' })
  email: string;

  @Expose()
  @ApiProperty({ type: 'string' })
  username: string;

  @Expose()
  @ApiProperty({ type: 'string' })
  avatar?: string;
}
