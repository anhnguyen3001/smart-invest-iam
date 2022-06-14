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
import { Role } from './role.entity';
import { Route } from './route.entity';

@Entity('permissions')
export class Permission extends BaseEntity {
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
  name: string;

  @Expose()
  @ApiProperty({
    type: 'string',
  })
  @Column({ length: 255 })
  code: string;

  @ManyToMany(() => Role, (role) => role.permissions)
  roles: Role[];

  @OneToMany(() => Route, (route) => route.permission, {
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  })
  routes: Route[];
}
