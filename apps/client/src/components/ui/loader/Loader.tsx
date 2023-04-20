import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const Loader = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleStart = (url: string) =>
      url !== router.asPath && setLoading(true);
    const handleComplete = (url: string) =>
      url === router.asPath && setLoading(false);

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  });
  return (
    <>
      {loading && (
        <div className="fixed right-5 bottom-5 z-50 p-2 text-white bg-black rounded-md">
          Please, wait...
        </div>
      )}
    </>
  );
};

export default Loader;
