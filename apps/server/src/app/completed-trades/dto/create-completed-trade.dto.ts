import { Asset, Trade } from '@rocketleagueapi/tradebot-api-types';

export class CreateCompletedTradeDto {
  userId: number;
  nickname: string;
  trade: Trade;
  inventory: {
    assets: Asset[];
    credits: number;
  };
}
