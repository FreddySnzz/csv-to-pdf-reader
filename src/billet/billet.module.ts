import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BilletService } from './billet.service';
import { BilletController } from './billet.controller';
import { BilletEntity } from './entities/billet.entity';
import { BilletRepository } from './billet.repository';
import { LotRepository } from 'src/lot/lot.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([BilletEntity])
  ],
  providers: [
    BilletService, 
    BilletRepository,
    LotRepository
  ],
  controllers: [BilletController],
  exports: [BilletService],
})
export class BilletModule {}
