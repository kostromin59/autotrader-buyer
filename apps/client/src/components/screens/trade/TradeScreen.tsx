import rlBot from '../../../store/bot';
import Container from '../../layouts/container/Container';
import Inventory from '../../ui/inventory/Inventory';
import Chat from './chat/Chat';
import ItemsWindow from './items-window/ItemsWindow';

const TradeScreen = () => {
  const onCreditsClick = (amount: number) => {
    rlBot.updateCredits(amount, true);
  };

  const onItemClick = (id: number) => {
    rlBot.updateAsset(id, undefined, true);
  };

  return (
    <section>
      <Container className="grid gap-3 py-5 grid-cols-[492px_1fr]">
        <Inventory
          limit={16}
          onItemClick={onItemClick}
          onCreditsClick={onCreditsClick}
        />
        <ItemsWindow />
        <Chat />
      </Container>
    </section>
  );
};

export default TradeScreen;
