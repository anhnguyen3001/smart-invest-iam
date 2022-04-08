import { MigrationInterface, QueryRunner } from 'typeorm';

export class addMailTokenTable1649425336946 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE mail_tokens(
        id INT(11) AUTO_INCREMENT NOT NULL PRIMARY KEY,
        token VARCHAR(256) NOT NULL,
        type ENUM('verifyUser', 'forgetPassword') NOT NULL,
        user_id INT(11) NOT NULL,
        expired_at TIMESTAMP(6) NOT NULL,
        created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP(6),
        CONSTRAINT fk_mail_token_user FOREIGN KEY (user_id)
        REFERENCES users(id) ON DELETE CASCADE
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE mail_tokens;`);
  }
}
