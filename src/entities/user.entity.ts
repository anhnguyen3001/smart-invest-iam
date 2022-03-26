import { BaseEntity } from './base.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export enum MethodEnum {
  local = 'local',
  facebook = 'facebook',
  google = 'google',
}

@Entity('users')
export class User extends BaseEntity {
  @Exclude()
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  @ApiProperty({ type: 'string' })
  email: string;

  @Column({ length: 255 })
  @ApiProperty({ type: 'string' })
  username: string;

  @Exclude()
  @Column({ length: 255, nullable: true })
  password?: string;

  @Exclude()
  @Column({ type: 'boolean', default: false })
  isVerified?: boolean = false;

  @Column({ length: 255, nullable: true })
  @ApiProperty({ type: 'string' })
  avatar?: string;

  @Exclude()
  @Column({ length: 255, nullable: true })
  refreshToken?: string;

  @Exclude()
  @Column({ enum: MethodEnum })
  method?: MethodEnum = MethodEnum.local;
}
