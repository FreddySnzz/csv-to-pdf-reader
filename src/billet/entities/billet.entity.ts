import { 
  Column, 
  CreateDateColumn, 
  Entity, 
  PrimaryGeneratedColumn, 
  UpdateDateColumn 
} from "typeorm";

@Entity({ name: 'billet' })
export class BilletEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;
  
  @Column({ name: 'printed_name', nullable: false })
  printed_name: string;

  @Column({ name: 'lot_id', nullable: false })
  lot_id: number;

  @Column({ name: 'price', nullable: false })
  price: number;

  @Column({ name: 'typeable_line', nullable: false, unique: true })
  typeable_line: string;

  @Column({ name: 'enabled', nullable: false })
  enabled: boolean;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}