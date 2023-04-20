import { Asset } from '@rocketleagueapi/tradebot-api-types';
import { FC } from 'react';
import ItemCard from '../item-card/ItemCard';

interface IItemsList {
  assets: Asset[];
  onItemClick?: (id: number) => void;
}

const ItemsList: FC<IItemsList> = ({ assets, onItemClick }) => {
  return (
    <ul className="flex flex-wrap gap-1 py-3">
      {assets.map((asset) => (
        <ItemCard key={asset.id} item={asset} onClick={onItemClick} inList />
      ))}
    </ul>
  );
};

export default ItemsList;
