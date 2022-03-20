import { BaseEntity } from './base.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity('users')
export class User extends BaseEntity {
  @Exclude()
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  email: string;

  @Column({ length: 255 })
  username: string;

  @Exclude()
  @Column({ length: 255 })
  password: string;

  @Exclude()
  @Column({ type: 'boolean', default: false })
  isVerified = false;

  @Column({ length: 255, nullable: true })
  avatar?: string;

  @Exclude()
  @Column({ length: 255, nullable: true })
  refreshToken?: string;
}
