import { ApiProperty } from '@nestjs/swagger';

export class LoginFacebookDto {
  @ApiProperty({ type: 'string' })
  access_token: string;
}
