import { ConfigService } from '@nestjs/config';
import { SequelizeModuleOptions } from '@nestjs/sequelize';
import { TradeItem } from '../app/trades/entities/trade-item.entity';
import { TradeOffer } from '../app/trades/entities/trade-offer.entity';
import { UserEntity } from '../app/users/entities/user.entity';

// Sequelize config for module
export const sequelizeConfig = async (
  configService: ConfigService
): Promise<SequelizeModuleOptions> => ({
  dialect: 'postgres',
  host: configService.get('PG_HOST') || 'localhost',
  port: configService.get<number>('PG_PORT') || 5432,
  username: configService.get('PG_USERNAME') || 'postgres',
  password: configService.get('PG_PASSWORD') || 'postgres_password',
  database: configService.get('PG_DATABASE') || 'postgres',
  models: [UserEntity, TradeOffer, TradeItem],
  autoLoadModels: true,
  synchronize: true,
});
