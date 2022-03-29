import { LoginMethodEnum } from 'src/common';

export class JWTPayload {
  sub: number;
  email: string;
}

export class LoginSocialInfo {
  email: string;
  username: string;
  avatar: string;
  method: LoginMethodEnum;
}
