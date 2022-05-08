import { MigrationInterface, QueryRunner } from 'typeorm';

export class createOtpTable1649516323748 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE otps(
        id INT(11) AUTO_INCREMENT NOT NULL PRIMARY KEY,
        created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP(6),
        deleted_at TIMESTAMP(6) NULL,
        user_id INT(11) NOT NULL,
        secret VARCHAR(255) NOT NULL,
        type ENUM('verifyUser', 'resetPassword') NOT NULL,
        expired_at TIMESTAMP(6) NULL,
        CONSTRAINT fk_otp_user FOREIGN KEY (user_id)
        REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE 
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE otps;`);
  }
}
