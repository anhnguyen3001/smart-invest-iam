import { ApiProperty } from '@nestjs/swagger';
import { LoginMethodEnum } from 'src/common';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
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

  @Column({ enum: LoginMethodEnum })
  method?: LoginMethodEnum = LoginMethodEnum.local;
}
