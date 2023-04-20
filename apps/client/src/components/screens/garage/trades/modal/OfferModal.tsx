import Title from '../../../../ui/title/Title';
import { Dispatch, FC, FormEvent, SetStateAction } from 'react';
import Modal from '../../../../ui/modal/Modal';
import Select from '../../../../ui/select/Select';
import { IInitialItemValue } from '../../types/initial-item-value.interface';
import { getItemInfo } from '../../../../../utils/decrypt-asset.util';
import {
  certsOptions,
  paintsOptions,
  productsOptions,
  qualityOptions,
  seriesOptions,
} from '../../../../../utils/options.util';
import Input from '../../../../ui/input/Input';
import Button from '../../../../ui/button/Button';
import Checkbox from '../../../../ui/checkbox/Checkbox';

interface IOfferModalProps {
  isModalOpened: boolean;
  onClose: () => void;
  onSubmit: (e: FormEvent) => void;
  has: IInitialItemValue;
  wants: IInitialItemValue;
  setHas: Dispatch<SetStateAction<IInitialItemValue>>;
  setWants: Dispatch<SetStateAction<IInitialItemValue>>;
  isLoading: boolean;
  isEdit?: boolean;
  garageTrade: number;
  garageItem: number;
  setGarageTrade: Dispatch<SetStateAction<number>>;
  setGarageItem: Dispatch<SetStateAction<number>>;
}

const OfferModal: FC<IOfferModalProps> = ({
  isModalOpened,
  onClose,
  onSubmit,
  has,
  wants,
  setHas,
  setWants,
  isLoading,
  isEdit,
  garageItem,
  garageTrade,
  setGarageTrade,
  setGarageItem,
}) => {
  return (
    <>
      <Modal
        title={isEdit ? 'Update offer' : 'Create offer'}
        visible={isModalOpened}
        onClose={onClose}
      >
        <form
          onSubmit={onSubmit}
          className="flex flex-col gap-4 items-center w-full min-w-[50rem]"
        >
          <fieldset className="flex gap-8 w-full">
            {/* Has item */}
            <fieldset className="flex flex-col gap-2 w-full">
              <Title type="h4" className="text-center">
                Has item
              </Title>
              {/* Item */}
              <Select
                onChange={(value: number) =>
                  setHas((prev) => ({
                    ...prev,
                    item: value,
                    quality: getItemInfo(value).quality,
                    special: getItemInfo(value).special,
                  }))
                }
                placeholder="Select item"
                options={productsOptions}
                outValue={productsOptions.find(
                  (option) => option.value === has.item
                )}
              />
              {/* Quality */}
              <Select
                onChange={(value: number | null) =>
                  setHas((prev) => ({ ...prev, quality: value }))
                }
                placeholder="Select quality"
                options={qualityOptions}
                showLimit={10}
                outValue={qualityOptions.find(
                  (option) => option.value === has.quality
                )}
                nullable
              />
              {/* Paint */}
              <Select
                onChange={(value: number | null) =>
                  setHas((prev) => ({ ...prev, paint: value }))
                }
                placeholder="Select paint"
                options={paintsOptions}
                showLimit={15}
                outValue={paintsOptions.find(
                  (option) => option.value === has.paint
                )}
                nullable
              />
              {/* Cert */}
              <Select
                onChange={(value: number | null) =>
                  setHas((prev) => ({ ...prev, cert: value }))
                }
                placeholder="Select cert"
                options={certsOptions}
                showLimit={16}
                outValue={certsOptions.find(
                  (option) => option.value === has.cert
                )}
                nullable
              />
              {/* Series */}
              <Select
                onChange={(value: number | null) =>
                  setHas((prev) => ({ ...prev, series: value }))
                }
                placeholder="Select series"
                options={seriesOptions}
                outValue={seriesOptions.find(
                  (option) => option.value === has.series
                )}
                nullable
              />
              {/* Amount */}
              <Input
                placeholder="Amount"
                type={'number'}
                pattern={'/^d+$/'}
                min="1"
                value={has.amount}
                onChange={(e) =>
                  setHas((prev) => ({
                    ...prev,
                    amount: Number(e.target.value) || 1,
                  }))
                }
              />
              <Checkbox
                id="Has blueprint"
                label="Blueprint?"
                checked={has.blueprint}
                onChange={(e) =>
                  setHas((prev) => ({
                    ...prev,
                    blueprint: e.target.checked,
                  }))
                }
              />
            </fieldset>
            {/* Wants item */}
            <fieldset className="flex flex-col gap-2 w-full">
              <Title type="h4" className="text-center">
                Wants item
              </Title>
              {/* Item */}
              <Select
                onChange={(value: number) =>
                  setWants((prev) => ({
                    ...prev,
                    item: value,
                    quality: getItemInfo(value).quality,
                    special: getItemInfo(value).special,
                  }))
                }
                placeholder="Select item"
                options={productsOptions}
                outValue={productsOptions.find(
                  (option) => option.value === wants.item
                )}
              />
              {/* Quality */}
              <Select
                onChange={(value: number | null) =>
                  setWants((prev) => ({ ...prev, quality: value }))
                }
                placeholder="Select quality"
                options={qualityOptions}
                showLimit={10}
                outValue={qualityOptions.find(
                  (option) => option.value === wants.quality
                )}
                nullable
              />
              {/* Paint */}
              <Select
                onChange={(value: number | null) =>
                  setWants((prev) => ({ ...prev, paint: value }))
                }
                placeholder="Select paint"
                options={paintsOptions}
                showLimit={15}
                outValue={paintsOptions.find(
                  (option) => option.value === wants.paint
                )}
                nullable
              />
              {/* Cert */}
              <Select
                onChange={(value: number | null) =>
                  setWants((prev) => ({ ...prev, cert: value }))
                }
                placeholder="Select cert"
                options={certsOptions}
                showLimit={16}
                outValue={certsOptions.find(
                  (option) => option.value === wants.cert
                )}
                nullable
              />
              {/* Series */}
              <Select
                onChange={(value: number | null) =>
                  setWants((prev) => ({ ...prev, series: value }))
                }
                placeholder="Select series"
                options={seriesOptions}
                outValue={seriesOptions.find(
                  (option) => option.value === wants.series
                )}
                nullable
              />
              {/* Amount */}
              <Input
                placeholder="Amount"
                type={'number'}
                pattern={'/^d+$/'}
                min="1"
                value={wants.amount}
                onChange={(e) =>
                  setWants((prev) => ({
                    ...prev,
                    amount: Number(e.target.value) || 1,
                  }))
                }
              />
              <Checkbox
                id="Wants blueprint"
                label="Blueprint?"
                checked={wants.blueprint}
                onChange={(e) =>
                  setWants((prev) => ({
                    ...prev,
                    blueprint: e.target.checked,
                  }))
                }
              />
            </fieldset>
          </fieldset>
          <fieldset className="flex gap-3 w-full">
            <fieldset className="w-full">
              <Title className="text-center" type="h3">
                Trade
              </Title>
              <Input
                placeholder="Garage trade"
                type={'number'}
                pattern={'/^d+$/'}
                min="1"
                value={garageTrade}
                onChange={(e) => setGarageTrade(Number(e.target.value))}
              />
            </fieldset>
            <fieldset className="w-full">
              <Title className="text-center" type="h3">
                Item
              </Title>
              <Input
                placeholder="Garage item"
                type={'number'}
                pattern={'/^d+$/'}
                min="1"
                value={garageItem}
                onChange={(e) => setGarageItem(Number(e.target.value))}
              />
            </fieldset>
          </fieldset>
          <Button disabled={isLoading}>
            {isEdit ? 'Update offer' : 'Create offer'}
          </Button>
        </form>
      </Modal>
    </>
  );
};

export default OfferModal;
