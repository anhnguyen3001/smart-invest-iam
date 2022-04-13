import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateOtpType1649864933865 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE otps MODIFY type ENUM('verifyUser', 'resetPassword') NOT NULL;`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE otps MODIFY type ENUM('verifyUser', 'forgetPassword') NOT NULL;`,
    );
  }
}
