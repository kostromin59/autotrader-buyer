import { ITradeOffer } from '@autotrader/interfaces';
import { api } from '../api';

interface IOfferItem {
  item: number;
  paint: number | null;
  cert: number | null;
  quality: number | null;
  series: number | null;
  special: number | null;
  blueprint: boolean;
  amount: number;
}

export interface IOffer {
  has: IOfferItem;
  wants: IOfferItem;
  garageItem: number;
  garageTrade: number;
}

export const TradesService = {
  async getTrades(accessToken?: string) {
    const { data } = await api.get<ITradeOffer[]>(
      '/trades',
      accessToken && {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return data;
  },
  async createTrade(dto: IOffer) {
    return await api.post('/trades', dto);
  },
  async updateTrade(id: number, dto: IOffer) {
    return await api.patch(`/trades/${id}`, dto);
  },
  async swapAccess(id: number) {
    return await api.post(`/trades/${id}`);
  },
  async delete(id: number) {
    return await api.delete(`/trades/${id}`);
  },
};
