import { Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { TelegramController } from './telegram.controller';
import { TelegrafModule } from 'nestjs-telegraf';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { telegrafConfig } from '../../assets/telegraf-config';
import { TelegramUdpate } from './telegram.update';

@Module({
  imports: [
    TelegrafModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: telegrafConfig,
    }),
  ],
  controllers: [TelegramController],
  providers: [TelegramService, TelegramUdpate],
  exports: [TelegramService],
})
export class TelegramModule {}
