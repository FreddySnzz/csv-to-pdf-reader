import { BadRequestException, Injectable } from '@nestjs/common';
import { 
  DataSource, 
  Repository, 
  ILike, 
  Between, 
  FindOptionsWhere 
} from 'typeorm';

import { BilletEntity } from './entities/billet.entity';
import { LotEntity } from '../lot/entities/lot.entity';
import { CreateBilletDto } from './dtos/create-billet.dto';

@Injectable()
export class BilletRepository extends Repository<BilletEntity> {
  constructor(private dataSource: DataSource) {
    super(BilletEntity, dataSource.createEntityManager());
  }

  async findAll(
    name?: string,
    initialPrice?: number,
    finalPrice?: number,
    lotId?: number
  ): Promise<BilletEntity[]> {
    const where: FindOptionsWhere<BilletEntity> = { enabled: true };
  
    if (name) {
      where.printed_name = ILike(`%${name}%`);
    };
  
    if (initialPrice !== undefined && finalPrice !== undefined) {
      where.price = Between(initialPrice, finalPrice);
    } else if (initialPrice !== undefined) {
      where.price = Between(initialPrice, Number.MAX_VALUE);
    } else if (finalPrice !== undefined) {
      where.price = Between(0, finalPrice);
    };
  
    if (lotId) {
      where.lot_id = lotId;
    };
    
    return await this.find({ where });
  };

  async findOneByTypeableLineAndName(
    printed_name?: string,
    typeable_line?: string
  ): Promise<BilletEntity> {
    return this.findOne({
      where: { 
        printed_name,
        typeable_line
      },
    });
  };

  async saveBillet(
    createBilletDto: CreateBilletDto,
    lotEntity?: LotEntity
  ): Promise<BilletEntity> {
    const verifyBilletDuplicated = await this.findOneByTypeableLineAndName(
      createBilletDto.printed_name,
      createBilletDto.typeable_line
    );

    if (verifyBilletDuplicated) {
      throw new BadRequestException(`Billet already exists`);
    };

    return this.save({
      printed_name: createBilletDto.printed_name,
      lot_id: Number(lotEntity.id),
      price: createBilletDto.price,
      typeable_line: createBilletDto.typeable_line,
      enabled: true,
    });
  };
}
