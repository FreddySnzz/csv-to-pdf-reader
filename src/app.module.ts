import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { typeOrmService } from './config/typeorm.config';
import { BilletModule } from './billet/billet.module';
import { LotModule } from './lot/lot.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(typeOrmService.getTypeormConfig()),
    BilletModule,
    LotModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
