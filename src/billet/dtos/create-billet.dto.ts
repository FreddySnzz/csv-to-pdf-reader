import { IsNumber, IsString } from "class-validator";

export class CreateBilletDto {
  @IsString()
  printed_name: string;

  @IsNumber()
  lot_id: number;

  @IsNumber()
  price: number;

  @IsString()
  typeable_line: string;
}
