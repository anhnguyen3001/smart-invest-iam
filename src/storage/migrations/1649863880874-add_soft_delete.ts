import { MigrationInterface, QueryRunner } from 'typeorm';

export class addSoftDelete1649863880874 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE permissions ADD COLUMN deleted_at TIMESTAMP(6) NULL;`,
    );
    await queryRunner.query(
      `ALTER TABLE role_permission ADD COLUMN deleted_at TIMESTAMP(6) NULL;`,
    );
    await queryRunner.query(
      `ALTER TABLE users ADD COLUMN deleted_at TIMESTAMP(6) NULL;`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE permissions DROP COLUMN deleted_at;`);
    await queryRunner.query(
      `ALTER TABLE role_permission DROP COLUMN deleted_at;`,
    );
    await queryRunner.query(`ALTER TABLE users DROP COLUMN deleted_at;`);
  }
}
