import { MigrationInterface, QueryRunner } from 'typeorm';

export class addIsVerifiedUser1648190271063 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE users ADD COLUMN is_verified TINYINT(1)',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE users DROP COLUMN is_verified');
  }
}
