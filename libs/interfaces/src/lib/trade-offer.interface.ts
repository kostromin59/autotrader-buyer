import { ITradeItem } from './trade-item.interface';

export interface ITradeOffer {
  id: number;
  isEnabled: boolean;
  garageTrade: number;
  garageItem: number;
  has: ITradeItem;
  wants: ITradeItem;
}
