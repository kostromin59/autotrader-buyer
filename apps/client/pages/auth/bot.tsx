import { AuthService } from '../../src/services/auth/auth.service';
import { GetServerSideProps, NextPage } from 'next';
import AuthBot from '../../src/components/screens/auth-bot/AuthBot';
import { IUser } from '@autotrader/interfaces';
import { useQuery } from 'react-query';
import { useRouter } from 'next/router';

interface IBotAuthProps {
  user: IUser;
}

const BotAuth: NextPage<IBotAuthProps> = ({ user }) => {
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

  return <AuthBot />;
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  try {
    const accessToken = req.cookies['accessToken'];

    const user = await AuthService.getProfile(accessToken);

    return {
      props: {
        user,
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

export default BotAuth;
