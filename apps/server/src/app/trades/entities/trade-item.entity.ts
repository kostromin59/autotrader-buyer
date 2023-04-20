import { ITradeItem } from '@autotrader/interfaces';
import {
  Table,
  Model,
  Column,
  PrimaryKey,
  AutoIncrement,
  Default,
  BelongsTo,
  AllowNull,
} from 'sequelize-typescript';
import { CreateItemDto } from '../dto/create-item.dto';
import { TradeOffer } from './trade-offer.entity';

@Table({ timestamps: false })
export class TradeItem
  extends Model<ITradeItem, CreateItemDto>
  implements ITradeItem {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  item: number;

  @Default(false)
  @AllowNull(false)
  @Column
  blueprint: boolean;

  @Default(0)
  @AllowNull(false)
  @Column
  paint: number;

  @Default(0)
  @AllowNull(false)
  @Column
  quality: number;

  @Default(0)
  @AllowNull(false)
  @Column
  cert: number;

  @Default(0)
  @AllowNull(false)
  @Column
  special: number;

  @Default(0)
  @AllowNull(false)
  @Column
  series: number;

  @Default(1)
  @AllowNull(false)
  @Column
  amount: number;

  @BelongsTo(() => TradeOffer, {
    as: 'has',
    foreignKey: 'hasId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  hasId: TradeOffer;

  @BelongsTo(() => TradeOffer, {
    as: 'wants',
    foreignKey: 'wantsId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  wantsId: TradeOffer;
}
