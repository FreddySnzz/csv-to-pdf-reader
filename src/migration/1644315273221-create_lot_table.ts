import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateLotTable1644315273221 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE public.lot (
                id integer NOT NULL,
                name character varying NOT NULL,
                enabled boolean NOT NULL DEFAULT false,
                created_at timestamp without time zone DEFAULT now() NOT NULL,
                updated_at timestamp without time zone DEFAULT now() NOT NULL,
                primary key (id)
            );
            
            CREATE SEQUENCE public.lot_id_seq
                AS integer
                START WITH 1
                INCREMENT BY 1
                NO MINVALUE
                NO MAXVALUE
                CACHE 1;
            
            ALTER SEQUENCE public.lot_id_seq OWNED BY public.lot.id;
            
            ALTER TABLE ONLY public.lot ALTER COLUMN id SET DEFAULT nextval('public.lot_id_seq'::regclass);
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE public.lot;
        `);
    }

}
