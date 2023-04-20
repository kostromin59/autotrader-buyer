import { FC } from 'react';
import cn from 'classnames';

interface IColorProps {
  color: number;
}

const Color: FC<IColorProps> = ({ color }) => {
  return (
    <div
      className={cn(
        'absolute left-2 top-2 z-20 rounded-full w-4 h-4 border-white border-2',
        {
          'bg-red-600': color === 1,
          'bg-lime-500': color === 2,
          'bg-black': color === 3,
          'bg-sky-400': color === 4,
          'bg-blue-600': color === 5,
          'bg-orange-700': color === 6,
          'bg-green-700': color === 7,
          'bg-purple-600': color === 8,
          'bg-pink-400': color === 9,
          'bg-orange-500': color === 10,
          'bg-gray-400': color === 11,
          'bg-white': color === 12,
          'bg-yellow-500': color === 13,
          'bg-amber-500': color === 14,
        }
      )}
    ></div>
  );
};

export default Color;
