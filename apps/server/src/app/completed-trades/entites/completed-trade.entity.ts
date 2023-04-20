import {
  AutoIncrement,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { UserEntity } from '../../users/entities/user.entity';
import { Asset, Trade } from '@rocketleagueapi/tradebot-api-types';
import { CreateCompletedTradeDto } from '../dto/create-completed-trade.dto';
import { ICompletedTrade } from '@autotrader/interfaces';

@Table({ updatedAt: false })
export class CompletedTradeEntity extends Model<
  ICompletedTrade,
  CreateCompletedTradeDto
> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  nickname: string;

  @Column({
    type: DataType.JSONB,
  })
  trade: Trade;

  @Column({
    type: DataType.JSONB,
  })
  inventory: {
    assets: Asset[];
    credits: number;
  };

  @ForeignKey(() => UserEntity)
  userId: number;

  @BelongsTo(() => UserEntity, {
    onDelete: 'CASCADE',
  })
  user: UserEntity;
}
