import { FC, ReactNode, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useOnClickOutside } from 'usehooks-ts';
import { GrClose } from 'react-icons/gr';

interface IModalProps {
  visible: boolean;
  title: string;
  children?: ReactNode;
  onClose: () => void;
}

const Modal: FC<IModalProps> = ({ children, title, visible, onClose }) => {
  const [isBrowser, setIsBrowser] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useOnClickOutside(ref, onClose, 'mousedown');

  useEffect(() => {
    setIsBrowser(true);
  }, []);

  if (!isBrowser || !visible) return null;

  return createPortal(
    <div
      className={
        'fixed inset-0 z-50 bg-opacity-70 bg-black flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none'
      }
    >
      <div
        ref={ref}
        className="relative p-4 mx-auto bg-white rounded-lg shadow-lg border-gray-200 "
      >
        <button className="absolute right-2 top-2" onClick={onClose}>
          <GrClose />
        </button>

        <div className="flex flex-col w-full items-center p-2">
          <h3 className="font-medium text-lg mb-2">{title}</h3>
          <div className="text-gray-600 text-sm">{children}</div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
