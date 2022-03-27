export enum LoginMethodEnum {
  local = 'local',
  facebook = 'facebook',
  google = 'google',
}

export class CreateUser {
  email: string;
  username: string;
  isVerified?: boolean;
  password?: string;
  method?: LoginMethodEnum;
}
