import { IOption } from '../../../types/option.interface';
import { Dispatch, FC, Ref, SetStateAction } from 'react';
import Filter from './Filter';
import List from './List';

interface IDropdownProps {
  options: IOption[];
  filter?: string;
  setFilter?: Dispatch<SetStateAction<string>>;
  onClick: ((value: IOption | null) => void) | ((value: IOption) => void);
  filterRef?: Ref<HTMLInputElement>;
}

const Dropdown: FC<IDropdownProps> = ({
  options,
  onClick,
  filter,
  setFilter,
  filterRef,
}) => {
  return (
    <div className="absolute left-0 z-50 w-full max-w-sm border-black top-[55px] border-[3px] rounded-[10px]">
      {setFilter && (
        <Filter filterRef={filterRef} filter={filter} setFilter={setFilter} />
      )}
      <List options={options} onClick={onClick} />
    </div>
  );
};

export default Dropdown;
