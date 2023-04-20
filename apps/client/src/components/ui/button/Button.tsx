import { FC, HTMLAttributes } from 'react';
import cn from 'classnames';

interface IButtonProps extends HTMLAttributes<HTMLButtonElement> {
  disabled?: boolean;
}

const Button: FC<IButtonProps> = ({
  children,
  disabled,
  className,
  ...props
}) => {
  return (
    <button
      {...props}
      disabled={disabled}
      className={cn(
        `cursor-pointer disabled:cursor-not-allowed hover:shadow-xl transition-all will-change-transform h-[50px] w-full max-w-sm border-black bg-black text-white rounded-[10px] text-xl ${className}`,
        {
          'opacity-80': disabled,
        }
      )}
    >
      {children}
    </button>
  );
};

export default Button;
