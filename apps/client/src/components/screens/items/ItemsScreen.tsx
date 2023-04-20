import Container from '../../layouts/container/Container';
import { observer } from 'mobx-react-lite';
import Title from '../../ui/title/Title';
import Inventory from '../../ui/inventory/Inventory';

const ItemsScreen = observer(() => {
  return (
    <section>
      <Container>
        <Title className="mb-3" type="h1">
          Items
        </Title>
        <Inventory limit={120} />
      </Container>
    </section>
  );
});

export default ItemsScreen;
