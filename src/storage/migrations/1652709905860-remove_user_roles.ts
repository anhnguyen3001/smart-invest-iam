import { MigrationInterface, QueryRunner } from 'typeorm';

export class removeUserRoles1652709905860 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE users
      ADD COLUMN role_id INT(11),
      ADD CONSTRAINT fk_user_role
      FOREIGN KEY (role_id) REFERENCES roles(id) ON UPDATE CASCADE ON DELETE SET NULL;
    `);

    await queryRunner.query(`
      DROP TABLE user_role;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE users
      DROP CONSTRAINT fk_user_role,
      DROP COLUMN role_id;
    `);

    await queryRunner.query(`
      CREATE TABLE user_role (
        id INT(11) AUTO_INCREMENT NOT NULL PRIMARY KEY,
        created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP(6),
        updated_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        deleted_at TIMESTAMP(6) NULL,
        user_id INT(11) NOT NULL,
        role_id INT(11) NOT NULL,
        CONSTRAINT fk_user_ur FOREIGN KEY (user_id)
        REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
        CONSTRAINT fk_role_ur FOREIGN KEY (role_id)
        REFERENCES roles(id) ON UPDATE CASCADE ON DELETE CASCADE
      );
    `);
  }
}
