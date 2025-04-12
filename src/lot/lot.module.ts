import { Module } from '@nestjs/common';

import { LotService } from './lot.service';
import { LotRepository } from './lot.repository';

@Module({
  providers: [
    LotService,
    LotRepository
  ]
})
export class LotModule {}
