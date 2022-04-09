import { LoginMethodEnum } from 'storage/entities/user.entity';

export interface IJWTPayload {
  sub: number;
  email: string;
}

export interface ILoginSocialInfo {
  email: string;
  username: string;
  avatar: string;
  method: LoginMethodEnum;
}
