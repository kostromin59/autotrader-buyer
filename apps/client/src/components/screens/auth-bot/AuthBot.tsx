import rlBot from '../../../store/bot';
import { BotStatus } from '../../../types/bot/bot-status.enum';
import { observer } from 'mobx-react-lite';
import { FormEvent, useState } from 'react';
import Container from '../../layouts/container/Container';
import Button from '../../ui/button/Button';
import Input from '../../ui/input/Input';
import Title from '../../ui/title/Title';
import { ILoginBot } from '../../../types/bot/login-bot.interface';
import { useRouter } from 'next/router';
import Text from '../../ui/text/Text';

const AuthBot = observer(() => {
  const router = useRouter();

  const [botData, setBotData] = useState<ILoginBot>({
    accountId: '',
    deviceId: '',
    secret: '',
  });
  const [error, setError] = useState('');

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await rlBot.loginBot(botData);
      router.replace('/select-bot');
    } catch {
      setError('Something went wrong');
    }
  };

  return (
    <section>
      <Container className="flex flex-col justify-center items-center h-screen">
        <Title type="h1" className="mb-3">
          Auth bot
        </Title>
        {error && <Text className="font-medium text-red-500">{error}</Text>}
        <form
          onSubmit={onSubmit}
          className="flex flex-col gap-3 min-w-[24rem]"
          autoComplete="off"
        >
          <Input
            value={botData.accountId}
            onChange={(e) =>
              setBotData((prev) => ({
                ...prev,
                accountId: e.target.value,
              }))
            }
            placeholder="Account ID"
          />
          <Input
            value={botData.deviceId}
            onChange={(e) =>
              setBotData((prev) => ({
                ...prev,
                deviceId: e.target.value,
              }))
            }
            placeholder="Device ID"
          />
          <Input
            value={botData.secret}
            onChange={(e) =>
              setBotData((prev) => ({
                ...prev,
                secret: e.target.value,
              }))
            }
            placeholder="Secret"
            type="password"
            autoComplete="new-password"
          />
          <Button disabled={rlBot.status === BotStatus.DISCONNECTED}>
            Submit
          </Button>
        </form>
      </Container>
    </section>
  );
});

export default AuthBot;
