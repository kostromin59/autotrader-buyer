import { Asset } from '@rocketleagueapi/tradebot-api-types';
import { FC } from 'react';
import Info from './Info';

interface IContentProps {
  onClick?: (id: number) => void;
  item: Asset;
}

const Content: FC<IContentProps> = ({ item, onClick }) => {
  return (
    <>
      {onClick ? (
        <button
          className="inline-block h-full"
          onClick={() => onClick(item.id)}
        >
          <Info item={item} />
        </button>
      ) : (
        <Info item={item} />
      )}
    </>
  );
};

export default Content;
