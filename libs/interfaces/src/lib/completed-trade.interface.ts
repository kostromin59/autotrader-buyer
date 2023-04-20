import { Trade, Asset } from '@rocketleagueapi/tradebot-api-types';

export interface ICompletedTrade {
  id: number;
  userId: number;
  nickname: string;
  trade: Trade;
  inventory: {
    assets: Asset[];
    credits: number;
  };
  createdAt: Date;
}
