import { MigrationInterface, QueryRunner } from 'typeorm';

export class addAuthorization1649527616389 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE roles(
        id INT(11) AUTO_INCREMENT NOT NULL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        code VARCHAR(255) NOT NULL,
        created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP(6),
        updated_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        deleted_at TIMESTAMP(6) NULL
      );
      `);
    await queryRunner.query(`
      CREATE TABLE user_role (
        id INT(11) AUTO_INCREMENT NOT NULL PRIMARY KEY,
        user_id INT(11) NOT NULL,
        role_id INT(11) NOT NULL,
        created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP(6),
        updated_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        deleted_at TIMESTAMP(6) NULL,
        CONSTRAINT fk_user_ur FOREIGN KEY (user_id)
        REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
        CONSTRAINT fk_role_ur FOREIGN KEY (role_id)
        REFERENCES roles(id) ON UPDATE CASCADE ON DELETE CASCADE
      );
    `);
    await queryRunner.query(`
      CREATE TABLE permissions (
        id INT(11) AUTO_INCREMENT NOT NULL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        code VARCHAR(255) NOT NULL,
        created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP(6),
        updated_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)
      );
    `);
    await queryRunner.query(`
      CREATE TABLE role_permission (
        id INT(11) AUTO_INCREMENT PRIMARY KEY,
        role_id INT(11) NOT NULL,
        permission_id INT(11) NOT NULL,
        CONSTRAINT fk_role_rp FOREIGN KEY (role_id)
        REFERENCES roles(id) ON UPDATE CASCADE ON DELETE CASCADE,
        CONSTRAINT fk_permission_rp FOREIGN KEY (permission_id)
        REFERENCES permissions(id) ON UPDATE CASCADE ON DELETE CASCADE
      );
    `);
    await queryRunner.query(`
      CREATE TABLE routes (
        id INT(11) AUTO_INCREMENT PRIMARY KEY,
        route VARCHAR(255) NOT NULL,
        method ENUM('GET', 'POST', 'PUT', 'DELETE') NOT NULL,
        permission_id INT(11) NOT NULL,
        created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP(6),
        updated_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        deleted_at TIMESTAMP(6) NULL,
        CONSTRAINT fk_route_permission FOREIGN KEY (permission_id)
        REFERENCES permissions(id) ON UPDATE CASCADE ON DELETE CASCADE
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE user_role;');
    await queryRunner.query('DROP TABLE role_permission;');
    await queryRunner.query('DROP TABLE routes;');
    await queryRunner.query('DROP TABLE permissions;');
    await queryRunner.query('DROP TABLE roles;');
  }
}
