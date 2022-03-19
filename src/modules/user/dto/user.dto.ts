import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class UserDto {
  @ApiProperty({ type: 'number' })
  id: number;

  @ApiProperty({ type: 'string' })
  email: string;

  @ApiProperty({ type: 'string' })
  username: string;

  @ApiProperty({ type: 'string', nullable: true, required: false })
  avatar?: string;
}

export class SearchResultUserDto {
  @Type(() => UserDto)
  users: UserDto[];
}
