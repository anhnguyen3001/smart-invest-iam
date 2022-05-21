import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { Permission } from './permission.entity';
import { User } from './user.entity';

@Entity('roles')
export class Role extends BaseEntity {
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

  @ManyToMany(() => Permission, (permission) => permission.roles, {
    cascade: true,
  })
  @JoinTable({
    name: 'role_permission',
    joinColumn: {
      name: 'role_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'permission_id',
      referencedColumnName: 'id',
    },
  })
  permissions: Permission[];

  @OneToMany(() => User, (user) => user.role, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  users: User[];
}
