import { Module } from '@nestjs/common';
import { CompletedTradesService } from './completed-trades.service';
import { CompletedTradesController } from './completed-trades.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { CompletedTradeEntity } from './entites/completed-trade.entity';

@Module({
  imports: [SequelizeModule.forFeature([CompletedTradeEntity])],
  controllers: [CompletedTradesController],
  providers: [CompletedTradesService],
})
export class CompletedTradesModule { }
