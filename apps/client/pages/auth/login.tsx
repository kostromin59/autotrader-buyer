import { GetServerSideProps } from 'next';
import LoginScreen from '../../src/components/screens/login-screen/LoginScreen';
import { AuthService } from '../../src/services/auth/auth.service';

const LoginPage = () => {
  return (
    <>
      <LoginScreen />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  try {
    const accessToken = req.cookies['accessToken'];

    if (!accessToken) {
      return { props: {} };
    }

    await AuthService.getProfile(accessToken);

    return {
      redirect: {
        destination: '/',
        permanent: true,
      },
    };
  } catch (error) {
    return { props: {} };
  }
};

export default LoginPage;
