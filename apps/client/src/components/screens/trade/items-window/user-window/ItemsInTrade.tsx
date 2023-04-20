import { Asset } from '@rocketleagueapi/tradebot-api-types';
import ItemCard from '../../../../ui/item-card/ItemCard';
import { FC } from 'react';

interface IItemsInTradeProps {
  items: Asset[];
  onItemClick?: (id: number) => void;
}

const ItemsInTrade: FC<IItemsInTradeProps> = ({ items, onItemClick }) => {
  return (
    <ul className="flex overflow-scroll flex-wrap gap-1 max-h-[360px]">
      {items.map((item) => (
        <ItemCard item={item} key={item.id} onClick={onItemClick} inList />
      ))}
    </ul>
  );
};
export default ItemsInTrade;
