import { IUser } from '@autotrader/interfaces';
import { UserRole } from '@autotrader/enums';
import {
  Table,
  Model,
  Column,
  AutoIncrement,
  Default,
  IsEmail,
  PrimaryKey,
  DataType,
  HasMany,
} from 'sequelize-typescript';
import { CreateUserDto } from '../dto/create-user.dto';
import { TradeOffer } from '../../trades/entities/trade-offer.entity';

interface IUserEntityCreateDto extends CreateUserDto {
  password: string;
}

@Table({ timestamps: false })
export class UserEntity
  extends Model<IUser, IUserEntityCreateDto>
  implements IUser
{
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @IsEmail
  @Column
  email: string;

  @Column
  password: string;

  @Default(UserRole.USER)
  @Column({ type: DataType.STRING })
  role: UserRole;

  @Default(true)
  @Column
  hasAccess: boolean;

  @Column
  telegram: string;

  @Column
  key: string;

  @HasMany(() => TradeOffer, { onDelete: 'CASCADE' })
  tradeOffers: TradeOffer[];
}
