import { ICompletedTrade } from '@autotrader/interfaces';
import Link from 'next/link';
import { FC } from 'react';
import Container from '../../../layouts/container/Container';
import Title from '../../../ui/title/Title';

interface IUserCompletedTradesProps {
  completedTrades: Pick<ICompletedTrade, 'id' | 'createdAt'>[];
}

const UserCompletedTrades: FC<IUserCompletedTradesProps> = ({
  completedTrades,
}) => {
  return (
    <section className="py-5">
      <Container>
        <ul className="flex flex-wrap gap-3">
          {completedTrades.map((trade) => {
            const date = new Date(trade.createdAt);
            return (
              <li key={trade.id} className="p-3 bg-black rounded-md">
                <Link href={`/completed-trades/${trade.id}`}>
                  <Title className="text-white">Trade id: {trade.id}</Title>
                  <Title className="font-medium text-white" type="h3">
                    {date.toISOString().replace('T', ' ').substring(0, 19)}
                  </Title>
                </Link>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
};

export default UserCompletedTrades;
