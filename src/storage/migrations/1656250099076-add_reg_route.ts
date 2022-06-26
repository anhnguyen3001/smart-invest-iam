import { MigrationInterface, QueryRunner } from 'typeorm';

export class addRegRoute1656250099076 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE routes ADD COLUMN reg_uri VARCHAR(255) AFTER route;`,
    );
    await queryRunner.query(
      `ALTER TABLE routes CHANGE route name VARCHAR(255) NOT NULL;`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE routes DROP COLUMN reg_uri;`);
    await queryRunner.query(
      `ALTER TABLE routes CHANGE name route VARCHAR(255) NOT NULL;`,
    );
  }
}
