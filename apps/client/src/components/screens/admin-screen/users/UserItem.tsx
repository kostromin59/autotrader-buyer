import { IUser } from '@autotrader/interfaces';
import { FC } from 'react';
import Button from '../../../ui/button/Button';
import Title from '../../../ui/title/Title';
import { AiFillLock, AiFillUnlock } from 'react-icons/ai';
import { BiRefresh, BiTrash } from 'react-icons/bi';
import { UserRole } from '@autotrader/enums';
import { useMutation, useQueryClient } from 'react-query';
import { UsersService } from '../../../../services/users/users.service';
import Link from 'next/link';

interface IUserItemProps {
  user: Omit<IUser, 'password'>;
}

const UserItem: FC<IUserItemProps> = ({ user }) => {
  const queryClient = useQueryClient();
  // Swap access
  const accessMutation = useMutation({
    mutationKey: 'users',
    mutationFn: (id: number) => UsersService.swapAccess(id),
    onSuccess: () => {
      queryClient.invalidateQueries('users');
    },
  });
  // Generate new password for user
  const refreshPasswordMutation = useMutation({
    mutationKey: 'users',
    mutationFn: (id: number) => UsersService.refreshPassword(id),
    onSuccess: () => {
      queryClient.invalidateQueries('users');
    },
  });
  // Delete user
  const deleteMutation = useMutation({
    mutationKey: 'users',
    mutationFn: (id: number) => UsersService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries('users');
    },
  });

  return (
    <li className="p-2 rounded-lg border-black border-[3px]">
      <Title className="mb-2 font-semibold">
        <Link href={`/completed-trades/user/${user.id}`}>{user.email}</Link>
      </Title>
      <div className="flex gap-1">
        <Button
          onClick={() => accessMutation.mutate(user.id)}
          disabled={accessMutation.isLoading}
          className="flex justify-center items-center text-[28px]"
        >
          {user.hasAccess ? <AiFillLock /> : <AiFillUnlock />}
        </Button>
        <Button
          onClick={() => refreshPasswordMutation.mutate(user.id)}
          disabled={refreshPasswordMutation.isLoading}
          className="flex justify-center items-center text-[28px]"
        >
          <BiRefresh />
        </Button>
        {user.role !== UserRole.ADMIN && (
          <Button
            onClick={() => deleteMutation.mutate(user.id)}
            disabled={deleteMutation.isLoading}
            className="flex justify-center items-center text-[28px]"
          >
            <BiTrash />
          </Button>
        )}
      </div>
    </li>
  );
};

export default UserItem;
