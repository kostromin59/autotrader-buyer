import { IUser } from '@autotrader/interfaces';
import { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';
import { useQuery } from 'react-query';
import Container from '../src/components/layouts/container/Container';
import PageLayout from '../src/components/layouts/page-layout/PageLayout';
import { AuthService } from '../src/services/auth/auth.service';
import rlBot from '../src/store/bot';

interface IIndexProps {
  user: IUser | null;
}

const Index: NextPage<IIndexProps> = ({ user }) => {
  const { data } = useQuery({
    queryKey: 'user',
    queryFn: () => AuthService.getProfile(),
    initialData: user,
    onSuccess: (data) => {
      rlBot.setApiKey(data.key);
    },
    onError: () => {
      // Disconnect bot
    },
  });

  return (
    <PageLayout header={!!data}>
      <Container className="flex flex-col">
        <Link href="/admin">Admin page</Link>
        <Link href="/auth/login">Login page</Link>
        <Link href="/items">Items page</Link>
      </Container>
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
      props: {
        user: null,
      },
    };
  }
};

export default Index;
