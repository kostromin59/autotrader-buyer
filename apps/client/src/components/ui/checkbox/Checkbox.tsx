import { FC, InputHTMLAttributes } from 'react';
import s from './Checkbox.module.scss';
import cn from 'classnames';

interface ICheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
}

const Checkbox: FC<ICheckboxProps> = ({ label, id, ...props }) => {
  return (
    <div className="flex items-center">
      <input
        type="checkbox"
        id={id}
        className={cn('cursor-pointer absolute -z-10 opacity-0', {
          [s.checkbox]: true,
        })}
        {...props}
      />
      <label
        htmlFor={id}
        className={cn('cursor-pointer text-xl text-black select-none', {
          [s.label]: true,
        })}
      >
        {label}
      </label>
    </div>
  );
};

export default Checkbox;
