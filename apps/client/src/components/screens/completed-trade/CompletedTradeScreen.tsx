import { ICompletedTrade } from '@autotrader/interfaces';
import { FC } from 'react';
import Container from '../../layouts/container/Container';
import Inventory from '../../ui/inventory/Inventory';
import UserWindow from '../trade/items-window/user-window/UserWindow';

interface ICompletedTradeScreenProps {
  completedTrade: ICompletedTrade;
  isAdmin?: boolean;
}

const CompletedTradeScreen: FC<ICompletedTradeScreenProps> = ({
  completedTrade,
  isAdmin,
}) => {
  return (
    <section className="py-5">
      <Container className={isAdmin && 'grid grid-cols-[492px_1fr] gap-3'}>
        {isAdmin && (
          <Inventory customInventory={completedTrade.inventory} limit={16} />
        )}
        <div className="flex flex-col gap-3">
          <UserWindow
            nickname="YOU"
            credits={completedTrade.trade.credits.give}
            items={completedTrade.trade.assets.give}
          />
          <UserWindow
            nickname={completedTrade.nickname}
            credits={completedTrade.trade.credits.get}
            items={completedTrade.trade.assets.get}
          />
        </div>
      </Container>
    </section>
  );
};

export default CompletedTradeScreen;
