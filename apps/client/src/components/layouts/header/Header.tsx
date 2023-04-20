import Link from 'next/link';
import { useRouter } from 'next/router';
import Text from '../../ui/text/Text';
import Container from '../container/Container';
import User from './user/User';

const Header = () => {
  const { route } = useRouter();

  return (
    <header className="h-[70px] mb-5 w-full shadow-md text-white bg-black">
      <Container className="h-full flex justify-between items-center ">
        <nav>
          <ul className="flex gap-3">
            <li>
              <Link href="items">
                <Text underline={route.startsWith('/items')}>Items</Text>
              </Link>
            </li>
            <li>
              <Link href="garage">
                <Text underline={route.startsWith('/garage')}>Garage</Text>
              </Link>
            </li>
            <li>
              <Link href="trade">
                <Text underline={route.startsWith('/trade')}>Trade</Text>
              </Link>
            </li>
          </ul>
        </nav>
        <User />
      </Container>
    </header>
  );
};

export default Header;
