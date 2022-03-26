import { ApiProperty } from '@nestjs/swagger';

export class TokenDto {
  @ApiProperty({ type: 'string' })
  accessToken: string;

  @ApiProperty({ type: 'string' })
  refreshToken: string;
}
