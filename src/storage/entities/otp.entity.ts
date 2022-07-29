import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CreateDeleteEntity } from './base.entity';
import { User } from './user.entity';

export enum OtpTypeEnum {
  verifyUser = 'verifyUser',
  resetPassword = 'resetPassword',
}

@Entity('otps')
export class Otp extends CreateDeleteEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 32 })
  secret: string;

  @Column({ type: 'enum', enum: OtpTypeEnum })
  type: string;

  @ManyToOne(() => User, (user) => user.otps)
  user: User;

  @Column({ type: 'timestamp', precision: 6, nullable: true })
  expiredAt: string;
}
