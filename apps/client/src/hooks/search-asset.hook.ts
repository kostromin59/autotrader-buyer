import { Asset } from '@rocketleagueapi/tradebot-api-types';
import { useState } from 'react';
import {
  getCert,
  getItemInfo,
  getPaints,
  getQualities,
  getSeries,
  getSpecial,
} from '../utils/decrypt-asset.util';

export const useSearchAsset = (assets: Asset[]) => {
  const [filter, setFilter] = useState('');

  const filteredAssets = assets.filter((asset) => {
    const words = filter.trim().split(' ');
    const itemName = (getItemInfo(asset.item).name || '')
      .toLowerCase()
      .replace(/: /g, ':')
      .split(' ')
      .join('-');
    const itemCert = (getCert(asset.cert) || '')
      .toLowerCase()
      .split(' ')
      .join('-');
    const itemSeries = (getSeries(asset.series) || '')
      .toLowerCase()
      .split(' ')
      .join('-');
    const itemColor = asset.paint
      ? getPaints(asset.paint).split(' ').length > 1
        ? getPaints(asset.paint)
          .match(/\b(\w)/g)
          ?.join('')
          .toLowerCase() || ''
        : getPaints(asset.paint).toLowerCase()
      : 'default';
    const itemQuality = getQualities(asset.quality)
      .toLowerCase()
      .split(' ')
      .join('-');
    const itemSpecial = (getSpecial(getItemInfo(asset.item).special) || '')
      .toLowerCase()
      .split(' ')
      .join('-');
    return words.every(
      (word) =>
        itemName.includes(word) ||
        itemCert.includes(word) ||
        itemSeries.includes(word) ||
        itemColor.includes(word) ||
        itemQuality.includes(word) ||
        (word === 'bp' && asset.blueprint !== 0) ||
        itemSpecial.includes(word)
    );
  });
  return { filteredAssets, setFilter };
};
