import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Permission } from './permission.entity';

export enum MethodEnum {
  get = 'GET',
  post = 'POST',
  put = 'PUT',
  delete = 'DELETE',
}

@Entity('routes')
export class Route extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty({ type: 'number' })
  id: number;

  @Column({ length: 255 })
  @ApiProperty({ type: 'string' })
  route: string;

  @Column({ enum: MethodEnum })
  @ApiProperty({ enum: MethodEnum })
  method: MethodEnum;

  @ManyToOne(() => Permission, (permission) => permission.routes, {
    nullable: true,
  })
  permission: Permission;
}
