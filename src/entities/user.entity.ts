import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { LoginMethodEnum } from 'src/common';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { MailToken } from './mail-token.entity';

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

  @OneToMany(() => MailToken, (mailToken) => mailToken.user)
  mailTokens: MailToken[];
}
