import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { LoginMethodEnum } from '../user.type';

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

  @Expose()
  @ApiProperty({ enum: LoginMethodEnum })
  method?: LoginMethodEnum;
}
