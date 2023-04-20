import {
  certs,
  paints,
  products,
  qualities,
  series,
} from '@rocketleagueapi/items';
import {
  getCert,
  getItemInfo,
  getPaints,
  getQualities,
  getSeries,
  getSlots,
  getSpecial,
} from './decrypt-asset.util';

export const productsOptions = Object.keys(products)
  .map((productId) => ({
    value: productId,
    label: getItemInfo(productId).name,
    special: getSpecial(getItemInfo(productId).special) || '',
    quality: getQualities(getItemInfo(productId).quality),
    slot: getSlots(getItemInfo(productId).slot),
    tradable: getItemInfo(productId).tradable,
  }))
  .filter((item) => item.tradable)
  .map((item) => ({
    value: Number(item.value),
    label: `${item.label} ${item.special && `(${item.special}) `}(${item.slot
      }) (${item.quality})`,
  }));

export const paintsOptions = Object.keys(paints).map((paint) => ({
  label: getPaints(paint),
  value: Number(paint),
}));

export const certsOptions = Object.keys(certs).map((cert) => ({
  value: Number(cert),
  label: getCert(cert),
}));

export const seriesOptions = Object.keys(series).map((ser) => ({
  value: Number(ser),
  label: getSeries(ser),
}));

export const qualityOptions = Object.keys(qualities)
  .map((quality) => ({
    value: Number(quality),
    label: getQualities(quality),
  }))
  .filter((quality) => quality.value !== 0);
