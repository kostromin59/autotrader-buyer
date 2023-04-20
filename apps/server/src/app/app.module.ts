import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { sequelizeConfig } from '../assets/sequelize-config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TelegramModule } from './telegram/telegram.module';
import { TradesModule } from './trades/trades.module';
import { CompletedTradesModule } from './completed-trades/completed-trades.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath:
        process.env.NODE_ENV !== 'development'
          ? '.env.server'
          : '.env.server.example',
    }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: sequelizeConfig,
    }),
    UsersModule,
    AuthModule,
    TelegramModule,
    TradesModule,
    CompletedTradesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
