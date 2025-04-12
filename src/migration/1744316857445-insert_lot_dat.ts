import { MigrationInterface, QueryRunner } from "typeorm";

export class InsertLotDat1744316857445 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO public.lot(id, name, enabled)	VALUES (3, '0017', true);
            INSERT INTO public.lot(id, name, enabled)	VALUES (6, '0018', true);
            INSERT INTO public.lot(id, name, enabled)	VALUES (7, '0019', true);
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
