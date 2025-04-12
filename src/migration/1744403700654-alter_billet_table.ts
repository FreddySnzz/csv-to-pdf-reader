import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterBilletTable1744403700654 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`
            ALTER TABLE billet ADD CONSTRAINT unique_typeable_line UNIQUE (typeable_line);
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
