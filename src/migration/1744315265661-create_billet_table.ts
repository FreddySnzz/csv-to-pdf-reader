import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateBilletTable1744315265661 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE public.billet (
                id integer NOT NULL,
                printed_name character varying NOT NULL,
                lot_id integer NOT NULL,
                price integer NOT NULL,
                typeable_line character varying NOT NULL,
                enabled boolean NOT NULL DEFAULT false,
                created_at timestamp without time zone DEFAULT now() NOT NULL,
                updated_at timestamp without time zone DEFAULT now() NOT NULL,
                primary key (id),
                foreign key (lot_id) references public.lot(id)
            );
            
            CREATE SEQUENCE public.billet_id_seq
                AS integer
                START WITH 1
                INCREMENT BY 1
                NO MINVALUE
                NO MAXVALUE
                CACHE 1;
            
            ALTER SEQUENCE public.billet_id_seq OWNED BY public.billet.id;
            
            ALTER TABLE ONLY public.billet ALTER COLUMN id SET DEFAULT nextval('public.billet_id_seq'::regclass);
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE public.billet;
        `);
    }

}
