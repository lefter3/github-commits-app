import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1742166241870 implements MigrationInterface {
  name = 'Init1742166241870';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "username" character varying NOT NULL, "lastLogin" character varying NOT NULL, CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "commit_count" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "count" integer NOT NULL, "repo" character varying NOT NULL, "username" character varying NOT NULL, "commitsDate" character varying NOT NULL, CONSTRAINT "PK_833aab16a7926efccac839cd31f" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "commit_count"`);
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
