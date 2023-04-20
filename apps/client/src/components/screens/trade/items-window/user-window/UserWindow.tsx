import { Asset } from '@rocketleagueapi/tradebot-api-types';
import { FC } from 'react';
import Title from '../../../../ui/title/Title';
import ItemsInTrade from './ItemsInTrade';

interface IUserWindowProps {
  nickname: string;
  credits: number;
  items: Asset[];
  onItemClick?: (id: number) => void;
}

const UserWindow: FC<IUserWindowProps> = ({
  nickname,
  credits,
  items,
  onItemClick,
}) => {
  return (
    <div>
      <div className="flex justify-between">
        <Title>{nickname}</Title>
        <Title type="h3">{credits}</Title>
      </div>
      <ItemsInTrade onItemClick={onItemClick} items={items} />
    </div>
  );
};

export default UserWindow;
