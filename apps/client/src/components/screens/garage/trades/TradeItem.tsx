import { ITradeOffer } from '@autotrader/interfaces';
import { TradesService } from '../../../../services/trades/trades.service';
import { Dispatch, FC, SetStateAction } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import Button from '../../../ui/button/Button';
import ItemCard from '../../../ui/item-card/ItemCard';
import Text from '../../../ui/text/Text';
import { IInitialItemValue } from '../types/initial-item-value.interface';
import {
  AiFillLock,
  AiFillUnlock,
  AiFillEdit,
  AiFillDelete,
} from 'react-icons/ai';

interface ITradeItemProps {
  offer: ITradeOffer;
  openModal: () => void;
  setHas: Dispatch<SetStateAction<IInitialItemValue>>;
  setWants: Dispatch<SetStateAction<IInitialItemValue>>;
  setEditingId: Dispatch<SetStateAction<number | null>>;
  setGarageItem: Dispatch<SetStateAction<number>>;
  setGarageTrade: Dispatch<SetStateAction<number>>;
}

const TradeItem: FC<ITradeItemProps> = ({
  offer,
  setEditingId,
  setWants,
  setHas,
  openModal,
  setGarageTrade,
  setGarageItem,
}) => {
  const queryClient = useQueryClient();

  const swapAccessMutation = useMutation({
    mutationKey: 'offers',
    mutationFn: () => TradesService.swapAccess(offer.id),
    onSuccess: () => {
      queryClient.invalidateQueries('offers');
    },
  });

  const deleteMutation = useMutation({
    mutationKey: 'offers',
    mutationFn: () => TradesService.delete(offer.id),
    onSuccess: () => {
      queryClient.invalidateQueries('offers');
    },
  });

  return (
    <li className="flex flex-col justify-between p-2 rounded-xl border-black border-[3px]">
      <div className="flex gap-4 items-center mb-3">
        <div>
          <ItemCard
            item={{
              ...offer.has,
              blueprint: offer.has.blueprint ? 1 : 0,
            }}
          />
          <Text className="mt-2 text-xl font-medium text-center">
            x{offer.has.amount}
          </Text>
        </div>
        <div>
          <Text className="font-bold text-center">FOR</Text>
          <Text className="font-bold text-center">
            {offer.garageTrade}-{offer.garageItem}
          </Text>
        </div>
        <div>
          <ItemCard
            item={{
              ...offer.wants,
              blueprint: offer.wants.blueprint ? 1 : 0,
            }}
          />
          <Text className="mt-2 text-xl font-medium text-center">
            x{offer.wants.amount}
          </Text>
        </div>
      </div>
      <div className="flex gap-1">
        <Button
          className="flex justify-center items-center"
          onClick={() => swapAccessMutation.mutate()}
        >
          {offer.isEnabled ? (
            <AiFillLock className="text-2xl" />
          ) : (
            <AiFillUnlock className="text-2xl" />
          )}
        </Button>
        <Button
          className="flex justify-center items-center"
          onClick={() => {
            setHas(offer.has);
            setWants(offer.wants);
            openModal();
            setEditingId(offer.id);
            setGarageItem(offer.garageItem);
            setGarageTrade(offer.garageTrade);
          }}
        >
          <AiFillEdit className="text-2xl" />
        </Button>
        <Button
          className="flex justify-center items-center"
          onClick={() => deleteMutation.mutate()}
        >
          <AiFillDelete className="text-2xl" />
        </Button>
      </div>
    </li>
  );
};

export default TradeItem;
