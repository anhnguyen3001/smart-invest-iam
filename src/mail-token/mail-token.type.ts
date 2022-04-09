import { MailTokenTypeEnum } from 'storage/entities/mail-token.entity';
import { User } from 'storage/entities/user.entity';

export class CreateMailToken {
  token: string;
  user: User;
  expiredAt: string;
  type: MailTokenTypeEnum;
}
