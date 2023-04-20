import Container from '../container/Container';
import { BsArrowRightCircle } from 'react-icons/bs';
import { FormEvent, useState } from 'react';
import rlBot from '../../../store/bot';
import { observer } from 'mobx-react-lite';
import { BotStatus } from '../../../types/bot/bot-status.enum';

const InviteToLobby = observer(() => {
  const [nickname, setNickname] = useState('');

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();

    rlBot.inviteToLobby(nickname);
    setNickname('');
  };

  return (
    <section className="mb-5">
      <Container className="flex justify-end">
        <form
          onSubmit={onSubmit}
          className="flex p-1 max-w-sm rounded-lg border-2 border-black"
        >
          <input
            type="text"
            placeholder="Invite to lobby"
            className="mr-1 text-lg opacity-100 outline-none disabled:cursor-not-allowed placeholder:text-black"
            onChange={(e) => setNickname(e.target.value)}
            value={nickname}
            disabled={rlBot.status !== BotStatus.FREE}
          />
          <button
            className="text-xl disabled:cursor-not-allowed"
            disabled={rlBot.status !== BotStatus.FREE}
          >
            <BsArrowRightCircle />
          </button>
        </form>
      </Container>
    </section>
  );
});

export default InviteToLobby;
