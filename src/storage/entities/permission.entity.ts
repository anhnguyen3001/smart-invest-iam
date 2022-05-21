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
  @PrimaryGeneratedColumn()
  @ApiProperty({
    type: 'number',
  })
  @Expose()
  id: number;

  @Column({ length: 255 })
  @ApiProperty({
    type: 'string',
  })
  @Expose()
  name: string;

  @Column({ length: 255 })
  @ApiProperty({
    type: 'string',
  })
  @Expose()
  code: string;

  @ManyToMany(() => Role, (role) => role.permissions)
  roles: Role[];

  @OneToMany(() => Route, (route) => route.permission)
  routes: Route[];
}
