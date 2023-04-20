import { ITradeItem } from '@autotrader/interfaces';
import { IsNotEmptyObject, IsNumber } from 'class-validator';

export class CreateOfferDto {
  @IsNotEmptyObject()
  has: ITradeItem;

  @IsNotEmptyObject()
  wants: ITradeItem;

  @IsNumber()
  garageTrade: number;

  @IsNumber()
  garageItem: number;
}
