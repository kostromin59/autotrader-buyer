import rlBot from '../../../../store/bot';
import { BotStatus } from '../../../../types/bot/bot-status.enum';
import { observer } from 'mobx-react-lite';
import { FormEvent, useState } from 'react';
import { BsArrowRightCircle } from 'react-icons/bs';

const Chat = observer(() => {
  const [message, setMessage] = useState('');

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();

    rlBot.sendMessage(message);
    setMessage('');
  };

  return (
    <form onSubmit={onSubmit} className="flex p-1 border-black border-t-[3px]">
      <input
        className="px-1 w-full text-xl opacity-100 outline-none disabled:opacity-80 disabled:cursor-not-allowed placeholder:text-black"
        placeholder="Enter your message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        type="text"
        disabled={
          rlBot.status === BotStatus.FREE ||
          rlBot.status === BotStatus.DISCONNECTED ||
          rlBot.status === BotStatus.CONNECTED
        }
      />
      <button
        disabled={
          rlBot.status === BotStatus.FREE ||
          rlBot.status === BotStatus.DISCONNECTED ||
          rlBot.status === BotStatus.CONNECTED
        }
        className="text-2xl disabled:opacity-80 disabled:cursor-not-allowed"
      >
        <BsArrowRightCircle />
      </button>
    </form>
  );
});

export default Chat;
