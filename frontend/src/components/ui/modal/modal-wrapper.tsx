import { ReactNode } from 'react';

type ModalWrapperProps = {
  children: ReactNode;
  show: boolean;
  close: () => void;
};

const ModalWrapper = ({ children, show, close }: ModalWrapperProps) => {
  return (
    <div
      className={`${show ? 'flex' : 'hidden'} fixed z-[9999] h-screen w-screen items-center justify-center `}
    >
      <div
        onClick={close}
        className="absolute left-0 top-0 size-full cursor-pointer bg-[#00000080]"
      />
      {children}
    </div>
  );
};

export default ModalWrapper;
