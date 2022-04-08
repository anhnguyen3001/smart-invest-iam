import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';
import { LoginMethodEnum } from 'src/common';

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

export class GetUserDto {
  @ApiProperty({ type: 'string' })
  @IsString()
  email: string;
}
