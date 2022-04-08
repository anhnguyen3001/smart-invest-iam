import { LoginMethodEnum } from 'src/common';

export class CreateUserDto {
  email: string;
  username: string;
  isVerified?: boolean = false;
  password?: string;
  method?: LoginMethodEnum = LoginMethodEnum.local;
}
