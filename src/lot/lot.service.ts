import { Injectable } from '@nestjs/common';

import { LotRepository } from './lot.repository';
import { LotEntity } from './entities/lot.entity';

@Injectable()
export class LotService {
  constructor(
    private readonly lotRepository: LotRepository,
  ) {}
}
