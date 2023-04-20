import { IUser } from '@autotrader/interfaces';
import { UsersService } from '../../../services/users/users.service';
import { FC } from 'react';
import { useQuery } from 'react-query';
import Container from '../../layouts/container/Container';
import UsersList from './users/UsersList';
import Title from '../../ui/title/Title';
import Actions from './actions/Actions';

interface IAdminScreenProps {
  users: IUser[];
}

const AdminScreen: FC<IAdminScreenProps> = ({ users }) => {
  const { data } = useQuery({
    initialData: users,
    queryKey: 'users',
    queryFn: () => UsersService.getUsers(),
  });
  return (
    <section className="p-5">
      <Container>
        <Title type="h1" className="mb-5">
          Users
        </Title>
        <Actions />
        <UsersList users={data} />
      </Container>
    </section>
  );
};

export default AdminScreen;
