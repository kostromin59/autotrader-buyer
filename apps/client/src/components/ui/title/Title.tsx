import { createElement, FC, HTMLAttributes } from 'react';

interface ITileProps extends HTMLAttributes<HTMLHeadingElement> {
  type?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

const Title: FC<ITileProps> = ({
  type = 'h2',
  children,
  className,
  ...props
}) => {
  return createElement(
    type,
    { ...props, className: 'font-bold text-2xl text-black ' + className },
    children
  );
};

export default Title;
