import { MailTokenTypeEnum } from 'src/modules';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CreatedEntity } from './base.entity';
import { User } from './user.entity';

@Entity('mail_tokens')
export class MailToken extends CreatedEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  token: string;

  @Column({ enum: MailTokenTypeEnum })
  type: string;

  @ManyToOne(() => User, (user) => user.mailTokens)
  user: User;

  @Column({ type: 'timestamp', precision: 6 })
  expiredAt: string;
}
