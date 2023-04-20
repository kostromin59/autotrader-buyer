import { FC, InputHTMLAttributes } from 'react';

const Input: FC<InputHTMLAttributes<HTMLInputElement>> = ({
  className,
  ...props
}) => {
  return (
    <>
      <input
        className={`w-full max-w-sm text-xl text-center border-black outline-none h-[50px] border-[3px] rounded-[10px] placeholder:text-black ${className}`}
        {...props}
      />
    </>
  );
};

export default Input;
