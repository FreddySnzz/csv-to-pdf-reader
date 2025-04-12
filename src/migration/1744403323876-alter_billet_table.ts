import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterBilletTable1744403323876 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`
            ALTER TABLE billet ALTER COLUMN price 
            SET DATA TYPE DOUBLE PRECISION USING price::DOUBLE PRECISION;

        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`
            ALTER TABLE billet ALTER COLUMN price TYPE NUMERIC(10,2) USING price::NUMERIC;
        `);
    }

}
