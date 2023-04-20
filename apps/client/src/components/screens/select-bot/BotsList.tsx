import { Bot, TradeBotState } from '@rocketleagueapi/tradebot-api-types';
import rlBot from '../../../store/bot';
import { useRouter } from 'next/router';
import { FC } from 'react';
import Text from '../../ui/text/Text';
import Title from '../../ui/title/Title';

interface IBotsListProps {
  bots: Bot[];
}

const BotsList: FC<IBotsListProps> = ({ bots }) => {
  const router = useRouter();
  return (
    <ul className="flex flex-wrap gap-[10px]">
      {bots.map((bot) => (
        <li key={bot.id}>
          <button
            onClick={async () => {
              // Auth bot if not
              if (
                bot.state === TradeBotState.AUTHENTICATION_FAILED ||
                bot.state === TradeBotState.NOT_READY
              ) {
                return router.push('/auth/bot');
              }

              // Select bot and return to the home page
              await rlBot.setBot(bot.botId);
              router.replace('/');
            }}
            className="p-3 bg-black rounded-md"
          >
            <Title className="mb-2 text-left text-white">{bot.name}</Title>
            <Text className="text-left text-white">{bot.state}</Text>
          </button>
        </li>
      ))}
    </ul>
  );
};

export default BotsList;
