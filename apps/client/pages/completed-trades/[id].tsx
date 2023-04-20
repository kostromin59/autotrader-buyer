import { AuthService } from '../../src/services/auth/auth.service';
import { CompletedTradeService } from '../../src/services/completed-trade/completed-trade.service';
import { GetServerSideProps, NextPage } from 'next';
import { useQuery } from 'react-query';
import { ICompletedTrade, IUser } from '@autotrader/interfaces';
import { useRouter } from 'next/router';
import CompletedTradeScreen from '../../src/components/screens/completed-trade/CompletedTradeScreen';
import { UserRole } from '@autotrader/enums';

interface ICompletedTradeByIdProps {
  user: IUser;
  completedTrade: ICompletedTrade;
}

const CompletedTradeById: NextPage<ICompletedTradeByIdProps> = ({
  user,
  completedTrade,
}) => {
  const router = useRouter();
  // Current user
  const { data } = useQuery({
    queryKey: 'user',
    queryFn: () => AuthService.getProfile(),
    initialData: user,
    onError: () => {
      router.replace('/auth/login');
    },
  });

  return (
    <CompletedTradeScreen
      isAdmin={data?.role === UserRole.ADMIN}
      completedTrade={completedTrade}
    />
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  req,
  params,
}) => {
  try {
    const accessToken = req.cookies['accessToken'];
    const user = await AuthService.getProfile(accessToken);

    const completedTrade = await CompletedTradeService.getById(
      Number(params.id),
      accessToken
    );

    if (!completedTrade || !user)
      return {
        notFound: true,
      };

    return {
      props: {
        user,
        completedTrade,
      },
    };
  } catch (e) {
    return {
      notFound: true,
    };
  }
};

export default CompletedTradeById;
