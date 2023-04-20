import { AuthService } from '../../../services/auth/auth.service';
import rlBot from '../../../store/bot';
import Head from 'next/head';
import React, { FC, ReactNode } from 'react';
import { useQuery } from 'react-query';
import Header from '../header/Header';
import { BotStatus } from '../../../types/bot/bot-status.enum';
import { useRouter } from 'next/router';
import { observer } from 'mobx-react-lite';
import InviteToLobby from '../invite-to-lobby/InviteToLobby';
import { TradesService } from '../../../services/trades/trades.service';

interface IPageLayout {
  header?: boolean;
  main?: boolean;
  title?: string;
  children: ReactNode;
}

const blockedRoutes = ['/select-bot', '/auth', '/admin'];

const PageLayout: FC<IPageLayout> = observer(
  ({ header = false, main = false, title = 'Autotrader', children }) => {
    const router = useRouter();
    // Current user
    const { isSuccess } = useQuery({
      queryKey: 'user',
      queryFn: () => AuthService.getProfile(),
      onSuccess: (data) => {
        rlBot.setApiKey(data.key);
      },
    });

    // Offers
    useQuery({
      queryKey: 'offers',
      queryFn: () => TradesService.getTrades(),
      retry: () => isSuccess,
      onSuccess: (data) => {
        rlBot.setTrades(data);
      },
    });

    if (
      rlBot.status !== BotStatus.DISCONNECTED &&
      !rlBot.botNickname &&
      blockedRoutes.every((route) => !router.asPath.startsWith(route))
    ) {
      router.replace('/select-bot');
    }

    return (
      <>
        <Head>
          <title>{title}</title>
        </Head>
        {header && (
          <>
            <Header />
            <InviteToLobby />
          </>
        )}
        {main ? <main>{children}</main> : children}
      </>
    );
  }
);

export default PageLayout;
