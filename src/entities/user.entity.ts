import { BaseEntity } from '../common';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  email: string;

  @Column({ length: 255 })
  username: string;

  @Column({ length: 255 })
  password: string;

  @Column({ length: 255 })
  salt: string;

  @Column({ type: 'boolean', default: false })
  isVerified = false;

  @Column({ length: 255, nullable: true })
  avatar?: string;

  @Column({ length: 255, nullable: true })
  refreshToken?: string;
}
