import rlBot from '../../../../../store/bot';
import { BotStatus } from '../../../../../types/bot/bot-status.enum';
import { observer } from 'mobx-react-lite';
import Button from '../../../../ui/button/Button';

const Actions = observer(() => {
  return (
    <div className="flex gap-3">
      <Button
        onClick={() => rlBot.confirmTrade()}
        disabled={
          rlBot.status === BotStatus.ACCEPTING_TRADE ||
          rlBot.status === BotStatus.IN_LOBBY ||
          rlBot.status === BotStatus.FREE ||
          rlBot.status === BotStatus.DISCONNECTED ||
          rlBot.status === BotStatus.CONNECTED
        }
      >
        Accept trade
      </Button>
      <Button
        onClick={() => rlBot.destroyLobby()}
        disabled={
          rlBot.status === BotStatus.FREE ||
          rlBot.status === BotStatus.DISCONNECTED ||
          rlBot.status === BotStatus.CONNECTED
        }
      >
        Leave lobby
      </Button>
    </div>
  );
});

export default Actions;
