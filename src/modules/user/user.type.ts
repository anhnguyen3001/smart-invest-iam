import { MethodEnum } from 'src/entities';

export class CreateUser {
  email: string;
  username: string;
  isVerified?: boolean;
  password?: string;
  method?: MethodEnum;
}
