import { Module } from '@nestjs/common';
import { TradesService } from './trades.service';
import { TradesController } from './trades.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { TradeOffer } from './entities/trade-offer.entity';
import { TradeItem } from './entities/trade-item.entity';

@Module({
  imports: [SequelizeModule.forFeature([TradeOffer, TradeItem])],
  controllers: [TradesController],
  providers: [TradesService],
})
export class TradesModule {}
