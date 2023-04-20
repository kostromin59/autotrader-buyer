import { UsersService } from '../../../../../services/users/users.service';
import { FormEvent, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import Button from '../../../../ui/button/Button';
import Input from '../../../../ui/input/Input';
import Modal from '../../../../ui/modal/Modal';

const CreateUser = () => {
  const [createUserData, setCreateUserData] = useState({
    email: '',
    key: '',
    telegram: '',
  });
  const [isModalOpened, setIsModalOpened] = useState(false);

  const queryClient = useQueryClient();

  const createUserMutation = useMutation({
    mutationKey: 'users',
    mutationFn: UsersService.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries('users');
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    createUserMutation.mutate(createUserData);

    // Close modal
    setIsModalOpened(false);
    // Reset form
    setCreateUserData({
      email: '',
      key: '',
      telegram: '',
    });
  };

  return (
    <>
      <Button onClick={() => setIsModalOpened(true)}>Create user</Button>
      <Modal
        title="Create user"
        visible={isModalOpened}
        onClose={() => setIsModalOpened(false)}
      >
        <form
          className="flex flex-col gap-y-2 min-w-[384px]"
          onSubmit={handleSubmit}
          autoComplete="off"
        >
          <Input
            value={createUserData.email}
            onChange={(e) =>
              setCreateUserData((prev) => ({ ...prev, email: e.target.value }))
            }
            placeholder="Email"
            type="email"
            autoComplete="off"
            required
          />
          <Input
            value={createUserData.key}
            onChange={(e) =>
              setCreateUserData((prev) => ({ ...prev, key: e.target.value }))
            }
            placeholder="Key"
            type="password"
            autoComplete="new-password"
            required
          />
          <Input
            value={createUserData.telegram}
            onChange={(e) =>
              setCreateUserData((prev) => ({
                ...prev,
                telegram: e.target.value,
              }))
            }
            placeholder="Telegram"
            autoComplete="off"
            required
          />
          <Button disabled={createUserMutation.isLoading}>Submit</Button>
        </form>
      </Modal>
    </>
  );
};

export default CreateUser;
