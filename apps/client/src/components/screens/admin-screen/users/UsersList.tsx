import { IUser } from '@autotrader/interfaces';
import { FC } from 'react';
import UserItem from './UserItem';

interface IUsersListProps {
  users: Omit<IUser, 'password'>[];
}

const UsersList: FC<IUsersListProps> = ({ users }) => {
  return (
    <ul className="flex gap-3 flex-wrap">
      {users.map((user) => (
        <UserItem user={user} key={user.id} />
      ))}
    </ul>
  );
};

export default UsersList;
