import { ITradeOffer } from '@autotrader/interfaces';
import { IOffer, TradesService } from '../../../services/trades/trades.service';
import { FC, FormEvent, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import Container from '../../layouts/container/Container';
import Title from '../../ui/title/Title';
import TradesList from './trades/TradesList';
import { IInitialItemValue } from './types/initial-item-value.interface';
import { getItemInfo } from '../../../utils/decrypt-asset.util';
import OfferModal from './trades/modal/OfferModal';
import Button from '../../ui/button/Button';

interface IGarageScreenProps {
  offers: ITradeOffer[];
}

const initialItemValue: IInitialItemValue = {
  item: 1,
  paint: null,
  cert: null,
  quality: getItemInfo(1).quality,
  series: null,
  special: null,
  blueprint: false,
  amount: 1,
};

const GarageScreen: FC<IGarageScreenProps> = ({ offers }) => {
  const [isModalOpened, setIsModalOpened] = useState(false);
  const [has, setHas] = useState<IInitialItemValue>(initialItemValue);
  const [wants, setWants] = useState<IInitialItemValue>(initialItemValue);
  const [garageTrade, setGarageTrade] = useState(1);
  const [garageItem, setGarageItem] = useState(1);
  const [editingId, setEditingId] = useState<number | null>(null);

  const queryClient = useQueryClient();

  const createOfferMutation = useMutation({
    mutationKey: 'offers',
    mutationFn: (dto: IOffer) => TradesService.createTrade(dto),
    onSuccess: () => {
      setHas(initialItemValue);
      setWants(initialItemValue);
      setIsModalOpened(false);
      setEditingId(null);
      setGarageTrade(1);
      setGarageItem(1);
      queryClient.invalidateQueries('offers');
    },
  });

  const updateOfferMutation = useMutation({
    mutationKey: ['offers', editingId],
    mutationFn: (dto: IOffer) => TradesService.updateTrade(editingId, dto),
    onSuccess: () => {
      setHas(initialItemValue);
      setWants(initialItemValue);
      setIsModalOpened(false);
      setEditingId(null);
      setGarageTrade(1);
      setGarageItem(1);
      queryClient.invalidateQueries('offers');
    },
  });

  const onSubmitCreate = (e: FormEvent) => {
    e.preventDefault();
    createOfferMutation.mutate({
      has,
      wants,
      garageItem,
      garageTrade,
    });
  };

  const onSubmitUpdate = (e: FormEvent) => {
    e.preventDefault();
    updateOfferMutation.mutate({
      has,
      wants,
      garageTrade,
      garageItem,
    });
  };

  const { data } = useQuery({
    queryKey: 'offers',
    queryFn: () => TradesService.getTrades(),
    initialData: offers,
  });

  return (
    <section>
      <Container>
        <Title type="h1">Trade offers</Title>
        <Button onClick={() => setIsModalOpened(true)}>Create offer</Button>
        <TradesList
          offers={data}
          openModal={() => setIsModalOpened(true)}
          setWants={setWants}
          setHas={setHas}
          setEditingId={setEditingId}
          setGarageTrade={setGarageTrade}
          setGarageItem={setGarageItem}
        />
        <OfferModal
          isLoading={createOfferMutation.isLoading}
          setWants={setWants}
          setHas={setHas}
          onSubmit={editingId ? onSubmitUpdate : onSubmitCreate}
          onClose={() => {
            setHas(initialItemValue);
            setWants(initialItemValue);
            setEditingId(null);
            setIsModalOpened(false);
            setGarageItem(1);
            setGarageTrade(1);
          }}
          isModalOpened={isModalOpened}
          has={has}
          wants={wants}
          isEdit={!!editingId}
          garageTrade={garageTrade}
          garageItem={garageItem}
          setGarageTrade={setGarageTrade}
          setGarageItem={setGarageItem}
        />
      </Container>
    </section>
  );
};

export default GarageScreen;
