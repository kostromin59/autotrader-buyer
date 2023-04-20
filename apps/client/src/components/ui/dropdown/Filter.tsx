import { Dispatch, FC, Ref, SetStateAction } from 'react';

interface IFilterProps {
  filter: string;
  setFilter: Dispatch<SetStateAction<string>>;
  filterRef?: Ref<HTMLInputElement>;
}

const Filter: FC<IFilterProps> = ({ filter, setFilter, filterRef }) => {
  return (
    <input
      ref={filterRef}
      className="w-full text-black font-medium text-base border-black border-b-[3px] rounded-t-[10px] outline-none p-1 placeholder-black"
      type="text"
      placeholder="Search..."
      value={filter}
      onChange={(e) => setFilter(e.target.value)}
    />
  );
};

export default Filter;
