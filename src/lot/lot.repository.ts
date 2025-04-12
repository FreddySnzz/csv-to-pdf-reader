import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { LotEntity } from './entities/lot.entity';

@Injectable()
export class LotRepository extends Repository<LotEntity> {
  constructor(private dataSource: DataSource) {
    super(
      LotEntity, 
      dataSource.createEntityManager()
    );
  }

  async findByName(
    lotName: number
  ): Promise<LotEntity> {
    let lotId = lotName.toString();
    if (lotId.length < 2) {
      lotId = `000${lotId}`;
    } else {
      lotId = `00${lotId}`;
    };

    const lot = await this.findOne({
      where: { 
        name: lotId,
        enabled: true,
      }
    });
  
    if (!lot) {
      throw new NotFoundException('Lot not found');
    };
    
    return lot;
  };
}
