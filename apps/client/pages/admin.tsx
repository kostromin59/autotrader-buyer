import { IUser } from '@autotrader/interfaces';
import { GetServerSideProps, NextPage } from 'next';
import PageLayout from '../src/components/layouts/page-layout/PageLayout';
import AdminScreen from '../src/components/screens/admin-screen/AdminScreen';
import { AuthService } from '../src/services/auth/auth.service';
import { UserRole } from '@autotrader/enums';
import { UsersService } from '../src/services/users/users.service';
import { useQuery } from 'react-query';
import { useRouter } from 'next/router';

interface IAdminProps {
  users: IUser[];
  user: IUser;
}

const Admin: NextPage<IAdminProps> = ({ users, user }) => {
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
    <PageLayout title="Admin page">
      <AdminScreen users={users} />
    </PageLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  try {
    const accessToken = req.cookies['accessToken'];

    const user = await AuthService.getProfile(accessToken);

    if (user.role !== UserRole.ADMIN)
      return {
        notFound: true,
      };

    const users = await UsersService.getUsers(accessToken);

    return {
      props: {
        users,
        user,
      },
    };
  } catch {
    return {
      notFound: true,
    };
  }
};

export default Admin;
