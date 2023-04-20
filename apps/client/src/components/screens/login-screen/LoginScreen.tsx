import { AxiosError } from 'axios';
import { useRouter } from 'next/router';
import { ChangeEvent, FormEvent, useState } from 'react';
import { useMutation } from 'react-query';
import Container from '../../layouts/container/Container';
import Button from '../../ui/button/Button';
import Input from '../../ui/input/Input';
import Text from '../../ui/text/Text';
import Title from '../../ui/title/Title';
import { AuthService } from '../../../services/auth/auth.service';
import { ILoginFormData } from '../../../services/auth/types';

const LoginScreen = () => {
  const [loginData, setLoginData] = useState<ILoginFormData>({
    email: '',
    password: '',
  });

  const router = useRouter();

  const {
    isLoading,
    error,
    mutate: login,
  } = useMutation({
    mutationFn: AuthService.login,
    onSuccess: () => {
      router.replace('/');
    },
  });

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    login({
      email: loginData.email.trim(),
      password: loginData.password.trim(),
    });
  };

  const setLoginFormData = (event: ChangeEvent<HTMLInputElement>) => {
    setLoginData((prev) => {
      return {
        ...prev,
        [event.target.name]: event.target.value,
      };
    });
  };

  return (
    <Container className="flex flex-col items-center h-screen justify-center ">
      <Title type="h1" className="mb-3">
        Login
      </Title>

      {error && (
        <Text className="text-red-500 mb-3 font-medium">
          {String(
            (error as AxiosError<{ message: string | string[] }>).response?.data
              .message
          )}
        </Text>
      )}

      <form
        onSubmit={onSubmit}
        className="flex w-[400px] flex-col gap-3 items-center"
      >
        <Input
          value={loginData.email}
          onChange={setLoginFormData}
          type="email"
          name="email"
          placeholder="Email"
          required
        />

        <Input
          value={loginData.password}
          onChange={setLoginFormData}
          type="password"
          name="password"
          placeholder="Password"
          maxLength={32}
          minLength={16}
          required
        />

        <Button disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Submit'}
        </Button>
      </form>
    </Container>
  );
};

export default LoginScreen;
