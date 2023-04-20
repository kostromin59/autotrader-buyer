import { ITradeOffer } from '@autotrader/interfaces';
import {
  AutoIncrement,
  BelongsTo,
  Column,
  Default,
  ForeignKey,
  HasOne,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { UserEntity } from '../../users/entities/user.entity';
import { CreateOfferDto } from '../dto/create-offer.dto';
import { TradeItem } from './trade-item.entity';

interface ITradeOfferEntityCreateDto extends CreateOfferDto {
  userId: number;
}

@Table({ timestamps: false })
export class TradeOffer
  extends Model<ITradeOffer, ITradeOfferEntityCreateDto>
  implements ITradeOffer {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Default(true)
  @Column
  isEnabled: boolean;

  @HasOne(() => TradeItem, {
    as: 'has',
    foreignKey: 'hasId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  has: TradeItem;

  @HasOne(() => TradeItem, {
    as: 'wants',
    foreignKey: 'wantsId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  wants: TradeItem;

  @ForeignKey(() => UserEntity)
  userId: number;

  @BelongsTo(() => UserEntity, {
    onDelete: 'CASCADE',
  })
  user: UserEntity;
}
