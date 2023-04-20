import {
  certs,
  paints,
  products,
  qualities,
  series,
  slots,
  specials,
} from '@rocketleagueapi/items';

export function getItemInfo(item: number | string) {
  return products[item.toString() as keyof typeof products];
}

export function getCert(cert: number | string) {
  return certs[cert.toString() as keyof typeof certs];
}

export function getSeries(seriesId: number | string) {
  return series[seriesId.toString() as keyof typeof series];
}

export function getSpecial(special: number | string) {
  return specials[special.toString() as keyof typeof specials];
}

export function getQualities(quality: number | string) {
  return qualities[quality.toString() as keyof typeof qualities];
}

export function getSlots(slot: number | string) {
  return slots[slot.toString() as keyof typeof slots];
}

export function getPaints(paint: number | string) {
  return paints[paint.toString() as keyof typeof paints];
}
