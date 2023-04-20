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
          className="flex flex-col gap-4 items-center w-full min-w-[24rem]"
        >
          <fieldset className="flex flex-col gap-8 justify-center items-center w-full">
            {/* Has item */}
            <fieldset className="flex flex-col gap-2 w-full">
              <Title type="h4" className="text-center">
                Credits
              </Title>
              {/* Amount */}
              <Input
                placeholder="Amount"
                type={'number'}
                pattern={'/^d+$/'}
                min="10"
                value={has.amount}
                onChange={(e) =>
                  setHas((prev) => ({
                    ...prev,
                    amount: Number(e.target.value) || 1,
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
          <Button disabled={isLoading}>
            {isEdit ? 'Update offer' : 'Create offer'}
          </Button>
        </form>
      </Modal>
    </>
  );
};

export default OfferModal;
