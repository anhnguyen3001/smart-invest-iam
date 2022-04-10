import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { Otp } from './otp.entity';
import { Role } from './role.entity';

export enum LoginMethodEnum {
  local = 'local',
  facebook = 'facebook',
  google = 'google',
}

@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  @ApiProperty({
    type: 'string',
  })
  @Expose()
  email: string;

  @Column({ length: 255 })
  @ApiProperty({
    type: 'string',
  })
  @Expose()
  username: string;

  @Column({ length: 255, nullable: true })
  password?: string;

  @Column({ type: 'boolean', default: false })
  isVerified?: boolean;

  @Column({ length: 255, nullable: true })
  @ApiProperty({
    type: 'string',
  })
  @Expose()
  avatar?: string;

  @Column({ length: 255, nullable: true })
  refreshToken?: string;

  @Column({ enum: LoginMethodEnum, default: LoginMethodEnum.local })
  method?: LoginMethodEnum;

  @OneToMany(() => Otp, (otp) => otp.user)
  otps: Otp[];

  @ManyToMany(() => Role, (role) => role.users)
  roles: Role[];
}
