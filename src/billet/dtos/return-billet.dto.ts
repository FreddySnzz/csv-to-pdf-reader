import { BilletEntity } from "../entities/billet.entity";

export class ReturnBilletDto {
  id: number;
  printed_name: string;
  lot_id: number;
  price: number;
  typeableLine: string;

  constructor(billetEntity: BilletEntity) {
    this.id = billetEntity.id;
    this.printed_name = billetEntity.printed_name;
    this.lot_id = billetEntity.lot_id;
    this.price = billetEntity.price;
    this.typeableLine = billetEntity.typeable_line;
  }
}
