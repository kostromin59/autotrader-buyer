import { IOption } from '../../../types/option.interface';
import { FC, useEffect, useRef, useState } from 'react';
import Dropdown from '../dropdown/Dropdown';
import { useOnClickOutside } from 'usehooks-ts';

interface ISelectProps {
  options: IOption[];
  placeholder?: string;
  nullable?: boolean;
  onChange?: (value: unknown) => void;
  showLimit?: number;
  outValue?: IOption;
}

const Select: FC<ISelectProps> = ({
  options,
  placeholder,
  nullable,
  onChange,
  showLimit = 10,
  outValue,
}) => {
  // const [value, setValue] = useState<IOption | null>(
  //   nullable ? null : options[0]
  // );
  const [value, setValue] = useState(
    outValue || (nullable ? null : options[0])
  );
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState('');

  const filterRef = useRef<HTMLInputElement>(null);

  // Close on click outside
  const ref = useRef<HTMLDivElement>(null);
  useOnClickOutside<HTMLDivElement>(
    ref,
    () => {
      setFilter('');
      setIsOpen(false);
    },
    'mousedown'
  );

  // With empty element if nullable
  const modifiedOptions = nullable
    ? [{ value: null, label: 'Nothing' }, ...options]
    : options;

  // onChange event
  useEffect(() => {
    onChange && onChange(value?.value || null);
    setFilter('');
    setIsOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  // Set out value on change
  useEffect(() => {
    outValue && setValue(outValue);
  }, [outValue]);

  // Search focus on open
  useEffect(() => {
    if (isOpen && filterRef.current) filterRef.current.focus();
  }, [isOpen]);

  // Filter options
  const filteredOptions = () => {
    let result = modifiedOptions
      // Remove selected item
      .filter((option) => !value || option.value !== value.value)
      // Remove null item
      .filter((option) => value || (value === null && option.value !== null));

    // Filter by words
    if (filter) {
      const words = filter.split(' ');
      words.forEach((word) => {
        result = result.filter((v) =>
          v.label.toLowerCase().includes(word.toLowerCase())
        );
      });
    }

    // Show all if symbols more then 5
    if (filter.length > 5) {
      return result;
    }

    // Show by limit
    return result.slice(0, showLimit);
  };

  return (
    <div className="max-w-sm relative" ref={ref}>
      <button
        type="button"
        className={`h-[50px] text-black w-full border-black border-[3px] rounded-[10px] text-${
          value && value.label.length >= 35 ? 'base' : 'xl'
        } text-center outline-none placeholder:text-black`}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {value ? String(value.label) : placeholder || ''}
      </button>
      {isOpen && (
        <Dropdown
          onClick={(value) => setValue(value)}
          options={filteredOptions()}
          filter={filter}
          setFilter={setFilter}
          filterRef={filterRef}
        />
      )}
    </div>
  );
};

export default Select;
