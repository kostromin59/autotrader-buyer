import { IUser } from '@autotrader/interfaces';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import PageLayout from '../src/components/layouts/page-layout/PageLayout';
import SelectBotScreen from '../src/components/screens/select-bot/SelectBotScreen';
import { AuthService } from '../src/services/auth/auth.service';

interface ISelectBotProps {
  user: IUser;
}

const SelectBot: NextPage<ISelectBotProps> = ({ user }) => {
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
    <PageLayout>
      <SelectBotScreen />
    </PageLayout>
  );
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

export default SelectBot;
