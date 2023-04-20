import { Asset } from '@rocketleagueapi/tradebot-api-types';
import {
  getCert,
  getItemInfo,
  getSeries,
  getSpecial,
} from '../../../../utils/decrypt-asset.util';
import Image from 'next/image';
import { FC, useState } from 'react';
import Title from '../../title/Title';
import Subinfo from './Subinfo';
import cn from 'classnames';
import Color from './Color';

interface IInfoProps {
  item: Asset;
}

const Info: FC<IInfoProps> = ({ item }) => {
  const [image, setImage] = useState(
    item.item === 4743
      ? '/credits.webp'
      : `https://cdn.rl.exchange/optimized/${item.item}.${item.paint}.webp`
  );

  return (
    <div className="relative h-full bg-black rounded-md w-[120px] overflow-clip">
      <div
        className={cn(
          'relative before:absolute before:left-0 before:top-0 before:w-full before:h-[120px] before:bg-gradient-to-b  before:to-transparent before:z-10',
          {
            'before:from-cyan-200': item.quality === 1,
            'before:from-blue-400': item.quality === 2,
            'before:from-purple-500': item.quality === 3,
            'before:from-red-500': item.quality === 4,
            'before:from-yellow-300': item.quality === 5,
            'before:from-fuchsia-500': item.quality === 6,
            'before:from-emerald-400': item.quality === 7,
            'before:from-amber-500': item.quality === 8,
          }
        )}
      >
        {item.paint !== 0 && <Color color={item.paint} />}
        <Image
          width={120}
          height={120}
          src={image}
          alt="Item image"
          onError={() =>
            setImage(`https://cdn.rl.exchange/optimized/${item.item}.0.webp`)
          }
          loading={'lazy'}
        />
        <Title
          type="h2"
          className="p-1 text-base font-normal text-center text-white"
        >
          {getItemInfo(item.item).name}
          {item.blueprint ? (
            <span>
              <br />
              (Blueprint)
            </span>
          ) : null}
        </Title>
      </div>
      <Subinfo
        cert={getCert(item.cert)}
        series={getSeries(item.series)}
        special={getSpecial(getItemInfo(item.item).special)}
      />
    </div>
  );
};

export default Info;
