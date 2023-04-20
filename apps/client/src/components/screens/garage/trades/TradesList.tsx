import { ITradeOffer } from '@autotrader/interfaces';
import { Dispatch, FC, SetStateAction } from 'react';
import { IInitialItemValue } from '../types/initial-item-value.interface';
import TradeItem from './TradeItem';

interface ITradesListProps {
  offers: ITradeOffer[];
  openModal: () => void;
  setHas: Dispatch<SetStateAction<IInitialItemValue>>;
  setWants: Dispatch<SetStateAction<IInitialItemValue>>;
  setEditingId: Dispatch<SetStateAction<number | null>>;
}

const TradesList: FC<ITradesListProps> = ({
  offers,
  setEditingId,
  openModal,
  setWants,
  setHas,
}) => {
  return (
    <ul className="flex flex-wrap gap-3 py-3">
      {offers &&
        offers.map((offer) => (
          <TradeItem
            offer={offer}
            key={offer.id}
            setEditingId={setEditingId}
            setHas={setHas}
            setWants={setWants}
            openModal={openModal}
          />
        ))}
    </ul>
  );
};

export default TradesList;