import { FC, ReactNode } from 'react';
import cn from 'classnames';

interface IContainerProps {
  children: ReactNode;
  className?: string;
}

const Container: FC<IContainerProps> = ({ children, className }) => {
  return (
    <div className={cn('container mx-auto px-4', className)}>{children}</div>
  );
};

export default Container;
