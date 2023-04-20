import { ICompletedTrade } from '@autotrader/interfaces';
import { Asset, Trade } from '@rocketleagueapi/tradebot-api-types';
import { api } from '../api';

interface ICompletedTradeCreateDto {
  trade: Trade;
  nickname: string;
  inventory: {
    assets: Asset[];
    credits: number;
  };
}

export const CompletedTradeService = {
  async create(dto: ICompletedTradeCreateDto) {
    const { data } = await api.post<ICompletedTrade>('/completed-trades', dto);
    return data;
  },
  async getById(id: number, accessToken?: string) {
    const { data } = await api.get<ICompletedTrade>(
      `/completed-trades/${id}`,
      accessToken && {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return data;
  },
  async getByUser(userId: number, accessToken?: string) {
    const { data } = await api.get<ICompletedTrade>(
      `/completed-trades/user/${userId}`,
      accessToken && {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return data;
  },
};
