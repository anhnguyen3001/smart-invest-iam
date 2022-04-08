import { User } from 'src/entities';

export enum MailTokenTypeEnum {
  verifyUser = 'verifyUser',
  forgetPassword = 'forgetPassword',
}

export class CreateMailToken {
  token: string;
  user: User;
  expiredAt: string;
  type: MailTokenTypeEnum;
}
