import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base.entity';

export enum MethodEnum {
  local = 'local',
  facebook = 'facebook',
  google = 'google',
}

@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  email: string;

  @Column({ length: 255 })
  username: string;

  @Column({ length: 255, nullable: true })
  password?: string;

  @Column({ type: 'boolean', default: false })
  isVerified?: boolean = false;

  @Column({ length: 255, nullable: true })
  @ApiProperty({ type: 'string' })
  avatar?: string;

  @Column({ length: 255, nullable: true })
  refreshToken?: string;

  @Column({ enum: MethodEnum })
  method?: MethodEnum = MethodEnum.local;
}
