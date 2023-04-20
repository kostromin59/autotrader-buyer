import { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from 'react-query';
import Head from 'next/head';
import '../src/styles/styles.css';
import Loader from '../src/components/ui/loader/Loader';

const queryClient = new QueryClient();

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Welcome to client!</title>
      </Head>
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
        <Loader />
      </QueryClientProvider>
    </>
  );
}

export default CustomApp;
