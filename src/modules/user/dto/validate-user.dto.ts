import { IsString } from 'class-validator';

export class ValidateUserQueryDto {
  @IsString()
  email: string;

  @IsString()
  token: string;
}
