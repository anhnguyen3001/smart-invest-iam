import { MigrationInterface, QueryRunner } from 'typeorm';

export class createUserTable1648176905384 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE user (
        id INT(11) AUTO_INCREMENT PRIMARY KEY NOT NULL,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255),
        method ENUM('local', 'facebook', 'google') NOT NULL,
        username VARCHAR(255) NOT NULL,
        avatar VARCHAR(255),
        refresh_token VARCHAR(255),
        created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP(6),
        updated_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)
      )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE user');
  }
}
