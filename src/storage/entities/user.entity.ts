import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  Column,
  Entity,
  ManyToOne,
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
  @Expose()
  @ApiProperty({
    type: 'number',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @Expose()
  @ApiProperty({
    type: 'string',
  })
  @Column({ length: 255 })
  email: string;

  @Expose()
  @ApiProperty({
    type: 'string',
  })
  @Column({ length: 255 })
  username: string;

  @Column({ length: 255, nullable: true })
  password?: string;

  @Expose()
  @Column({ type: 'boolean', default: false })
  isVerified?: boolean;

  @Expose()
  @ApiProperty({
    type: 'string',
  })
  @Column({ length: 255, nullable: true })
  avatar?: string;

  @Column({ length: 255, nullable: true })
  refreshToken?: string;

  @Expose()
  @ApiProperty({
    enum: LoginMethodEnum,
  })
  @Column({
    type: 'enum',
    enum: LoginMethodEnum,
    default: LoginMethodEnum.local,
  })
  method?: LoginMethodEnum;

  @OneToMany(() => Otp, (otp) => otp.user)
  otps: Otp[];

  @Expose()
  @ManyToOne(() => Role, (role) => role.users, {
    nullable: true,
  })
  role: Role;
}
