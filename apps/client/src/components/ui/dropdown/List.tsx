import { FC } from 'react';
import { IOption } from '../../../types/option.interface';

interface IListProps {
  options: IOption[];
  onClick: ((value: IOption | null) => void) | ((value: IOption) => void);
}

const List: FC<IListProps> = ({ options, onClick }) => {
  return (
    <ul className="max-h-[144px] overflow-y-scroll py-1 bg-white rounded-b-md">
      {options.map((option) => (
        <li key={String(option.value) || 'nullable'}>
          <button
            type="button"
            className="text-lg text-black p-1 w-full transition hover:bg-black hover:text-white text-left"
            onClick={() => onClick(option.value ? option : null)}
          >
            {option.label}
          </button>
        </li>
      ))}
    </ul>
  );
};

export default List;
