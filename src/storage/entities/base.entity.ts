import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

export class CreatedEntity {
  @CreateDateColumn({
    type: 'timestamp',
    precision: 6,
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: string;
}

export class BaseEntity extends CreatedEntity {
  @UpdateDateColumn({
    type: 'timestamp',
    precision: 6,
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt: string;
}
