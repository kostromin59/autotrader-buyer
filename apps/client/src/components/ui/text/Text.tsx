import { FC, HTMLAttributes } from 'react';
import cn from 'classnames';

interface ITileProps extends HTMLAttributes<HTMLParagraphElement> {
  underline?: boolean;
  size?: 'xs' | 'xl' | 'sm' | 'base' | 'lg' | '2xl';
}

const Text: FC<ITileProps> = ({
  underline = false,
  size = 'base',
  className = '',
  children,
  ...props
}) => {
  return (
    <p {...props} className={cn(`text-${size} ${className}`, { underline })}>
      {children}
    </p>
  );
};

export default Text;
