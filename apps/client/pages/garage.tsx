import { ITradeOffer, IUser } from '@autotrader/interfaces';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import PageLayout from '../src/components/layouts/page-layout/PageLayout';
import GarageScreen from '../src/components/screens/garage/GarageScreen';
import { AuthService } from '../src/services/auth/auth.service';
import { TradesService } from '../src/services/trades/trades.service';

interface IGarageProps {
  user: IUser;
  offers: ITradeOffer[];
}

const Garage: NextPage<IGarageProps> = ({ user, offers }) => {
  const router = useRouter();
  // Current user
  useQuery({
    queryKey: 'user',
    queryFn: () => AuthService.getProfile(),
    initialData: user,
    onError: () => {
      router.replace('/auth/login');
    },
  });
  return (
    <PageLayout header>
      <GarageScreen offers={offers} />
    </PageLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  try {
    const accessToken = req.cookies['accessToken'];

    const user = await AuthService.getProfile(accessToken);

    const tradeOffers = await TradesService.getTrades(accessToken);

    return {
      props: {
        user,
        offers: tradeOffers,
      },
    };
  } catch {
    return {
      redirect: {
        destination: '/auth/login',
        permanent: true,
      },
    };
  }
};

export default Garage;
