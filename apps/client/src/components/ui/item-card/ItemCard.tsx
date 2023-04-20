import { Asset } from '@rocketleagueapi/tradebot-api-types';
import { FC } from 'react';
import Content from './content/Content';

interface IItemCardProps {
  inList?: boolean;
  onClick?: (id: number) => void;
  item: Asset;
}

const ItemCard: FC<IItemCardProps> = ({ item, inList, onClick }) => {
  return (
    <>
      {inList ? (
        <li className="list-none">
          <Content item={item} onClick={onClick} />
        </li>
      ) : (
        <Content item={item} onClick={onClick} />
      )}
    </>
  );
};

export default ItemCard;
