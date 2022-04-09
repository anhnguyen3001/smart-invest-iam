import { LoginMethodEnum } from 'storage/entities/user.entity';

export class CreateUserDto {
  email: string;
  username: string;
  isVerified?: boolean = false;
  password?: string;
  method?: LoginMethodEnum = LoginMethodEnum.local;
}
