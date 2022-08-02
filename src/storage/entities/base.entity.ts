import { Expose } from 'class-transformer';
import { CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from 'typeorm';

export class CreateDeleteEntity {
  @Expose()
  @CreateDateColumn({
    type: 'timestamp',
    precision: 6,
    default: () => 'NOW()',
  })
  createdAt: string;

  @DeleteDateColumn({
    type: 'timestamp',
    precision: 6,
    onUpdate: 'NOW()',
  })
  deletedAt: string;
}

export class BaseEntity extends CreateDeleteEntity {
  @Expose()
  @UpdateDateColumn({
    type: 'timestamp',
    precision: 6,
    default: () => 'NOW()',
    onUpdate: 'NOW()',
  })
  updatedAt: string;
}
