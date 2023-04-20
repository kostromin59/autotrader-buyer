import rlBot from '../../../../store/bot';
import { observer } from 'mobx-react-lite';
import UserWindow from './user-window/UserWindow';
import Actions from './actions/Actions';

const ItemsWindow = observer(() => {
  const tradeState = rlBot.tradeState;
  const nickname = rlBot.lobbyOpponentNickname;

  const onItemClick = (id: number) => {
    rlBot.updateAsset(id, false);
  };

  return (
    <div className="flex flex-col row-span-2 gap-5">
      <UserWindow
        items={tradeState?.assets.give || []}
        credits={tradeState?.credits.give || 0}
        nickname={'YOU'}
        onItemClick={onItemClick}
      />
      <UserWindow
        items={tradeState?.assets.get || []}
        credits={tradeState?.credits.get || 0}
        nickname={nickname}
      />
      <Actions />
    </div>
  );
});

export default ItemsWindow;
