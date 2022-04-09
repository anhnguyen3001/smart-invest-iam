import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { CreatedEntity } from './base.entity';

export enum MailTokenTypeEnum {
  verifyUser = 'verifyUser',
  forgetPassword = 'forgetPassword',
}

@Entity('mail_tokens')
export class MailToken extends CreatedEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  token: string;

  @Column({ enum: MailTokenTypeEnum })
  type: string;

  @Column({ type: 'timestamp', precision: 6 })
  expiredAt: string;
}
