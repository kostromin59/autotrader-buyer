import { ITradeItem } from '@autotrader/interfaces';
import { IsNotEmptyObject } from 'class-validator';

export class CreateOfferDto {
  @IsNotEmptyObject()
  has: ITradeItem;

  @IsNotEmptyObject()
  wants: ITradeItem;
}
