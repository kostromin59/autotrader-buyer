import { ITradeItem } from './trade-item.interface';

export interface ITradeOffer {
  id: number;
  isEnabled: boolean;
  has: ITradeItem;
  wants: ITradeItem;
}
