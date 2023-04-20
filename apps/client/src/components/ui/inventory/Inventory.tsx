import { usePagintion } from '../../../hooks/pagination.hook';
import { useSearchAsset } from '../../../hooks/search-asset.hook';
import rlBot from '../../../store/bot';
import { observer } from 'mobx-react-lite';
import { FC, useEffect } from 'react';
import Input from '../input/Input';
import ItemsList from './ItemsList';
import Pagination from '../pagination/Pagination';
import Credits from './Credits';
import Title from '../title/Title';
import { Asset } from '@rocketleagueapi/tradebot-api-types';

interface IInventoryProps {
  onCreditsClick?: (amount: number) => void;
  onItemClick?: (id: number) => void;
  limit?: number;
  customInventory?: { assets: Asset[]; credits: number };
}

const Inventory: FC<IInventoryProps> = observer(
  ({ onItemClick, onCreditsClick, limit, customInventory }) => {
    const inventory = customInventory || rlBot.inventory;

    // Filter (search)
    const { filteredAssets, setFilter } = useSearchAsset(inventory.assets);

    // Pagination
    const { page, pages, setPage, render } = usePagintion(
      filteredAssets,
      limit
    );

    // Get inventory
    useEffect(() => {
      if (customInventory) return;
      rlBot.getInventory();
    }, []);

    return (
      <div>
        {onCreditsClick ? (
          <Credits
            creditsInInventory={inventory.credits}
            onCreditsClick={onCreditsClick}
          />
        ) : (
          <Title className="mb-3">Credits: {inventory.credits}</Title>
        )}
        <Input
          placeholder="Search"
          onChange={(e) => setFilter(e.target.value)}
        />
        <ItemsList onItemClick={onItemClick} assets={render} />
        <Pagination setPage={setPage} pages={pages} page={page} />
      </div>
    );
  }
);

export default Inventory;
