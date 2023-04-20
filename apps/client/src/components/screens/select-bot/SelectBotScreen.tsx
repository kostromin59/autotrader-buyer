import Container from '../../layouts/container/Container';
import rlBot from '../../../store/bot';
import Title from '../../ui/title/Title';
import { useEffect, useState } from 'react';
import { Bot } from '@rocketleagueapi/tradebot-api-types';
import Text from '../../ui/text/Text';
import BotsList from './BotsList';
import Link from 'next/link';

const SelectBotScreen = () => {
  const [bots, setBots] = useState<Bot[]>([]);

  useEffect(() => {
    const getBots = async () => {
      const rlBots = await rlBot.getBots();
      setBots(rlBots);
    };

    getBots();
  }, []);

  return (
    <section>
      <Container className="flex flex-col gap-3 justify-center items-center pb-20 h-screen">
        <Title type="h1">Select bot</Title>
        {bots.length ? <BotsList bots={bots} /> : <Text>Bots not found!</Text>}
        <Link href={'/auth/bot'} />
        <Link href={'/auth/bot'} className="underline">
          I need a new bot
        </Link>
      </Container>
    </section>
  );
};

export default SelectBotScreen;
