import { ApiProperty } from '@nestjs/swagger';

export class Tokens {
  @ApiProperty({ type: 'string' })
  accessToken: string;

  @ApiProperty({ type: 'string' })
  refreshToken: string;
}

export class TokenResultDto {
  data: Tokens;
}
