import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
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
  @Expose()
  @ApiProperty({ type: 'number' })
  @PrimaryGeneratedColumn()
  id: number;

  @Expose()
  @ApiProperty({ type: 'string' })
  @Column({ length: 255 })
  name: string;

  @Expose()
  @ApiProperty({ type: 'string' })
  @Column({ type: 'string' })
  regUri: string;

  @Expose()
  @ApiProperty({ enum: MethodEnum })
  @Column({ enum: MethodEnum })
  method: MethodEnum;

  @Expose()
  @ManyToOne(() => Permission, (permission) => permission.routes, {
    nullable: true,
  })
  permission: Permission;
}
