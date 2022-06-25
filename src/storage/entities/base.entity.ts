import { Expose } from 'class-transformer';
import { CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from 'typeorm';

export class CreateDeleteEntity {
  @Expose()
  @CreateDateColumn({
    type: 'timestamp',
    precision: 6,
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: string;

  @DeleteDateColumn({
    type: 'timestamp',
    precision: 6,
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  deletedAt: string;
}

export class BaseEntity extends CreateDeleteEntity {
  @Expose()
  @UpdateDateColumn({
    type: 'timestamp',
    precision: 6,
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt: string;
}
