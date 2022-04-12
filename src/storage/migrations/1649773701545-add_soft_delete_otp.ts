import { MigrationInterface, QueryRunner } from 'typeorm';

export class addSoftDeleteOtp1649773701545 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE otps ADD COLUMN deleted_at TIMESTAMP(6) NULL;`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE otps DROP COLUMN deleted_at;`);
  }
}
