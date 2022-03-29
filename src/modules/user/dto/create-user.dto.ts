import { LoginMethodEnum } from 'src/common';

export class CreateUserDto {
  email: string;
  username: string;
  isVerified?: boolean;
  password?: string;
  method?: LoginMethodEnum;
}
