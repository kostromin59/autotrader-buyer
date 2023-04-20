import { ITradeItem } from '@autotrader/interfaces';

export class UpdateOfferDto {
  has?: ITradeItem;
  wants?: ITradeItem;
}
