import { UserRole } from '@autotrader/enums';
import { ICompletedTrade } from '@autotrader/interfaces';
import { AuthService } from '../../../src/services/auth/auth.service';
import { CompletedTradeService } from '../../../src/services/completed-trade/completed-trade.service';
import { GetServerSideProps, NextPage } from 'next';
import UserCompletedTrades from '../../../src/components/screens/completed-trade/user/UserCompletedTrades';

interface ICompletedTradeByIdProps {
  completedTrades: Pick<ICompletedTrade, 'id' | 'createdAt'>[];
}

const CompletedTradeByUser: NextPage<ICompletedTradeByIdProps> = ({
  completedTrades,
}) => {
  return <UserCompletedTrades completedTrades={completedTrades} />;
};

export const getServerSideProps: GetServerSideProps = async ({
  req,
  params,
}) => {
  try {
    const accessToken = req.cookies['accessToken'];
    const user = await AuthService.getProfile(accessToken);

    if (user.role !== UserRole.ADMIN) {
      return {
        notFound: true,
      };
    }

    const completedTrades = await CompletedTradeService.getByUser(
      Number(params.id),
      accessToken
    );

    return {
      props: {
        completedTrades,
      },
    };
  } catch (e) {
    return {
      notFound: true,
    };
  }
};

export default CompletedTradeByUser;
