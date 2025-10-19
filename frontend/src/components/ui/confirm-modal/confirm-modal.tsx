import { ReactNode } from 'react';
import Skeleton from 'react-loading-skeleton';

import { Button } from '../button';
import ModalWrapper from '../modal/modal-wrapper';
import 'react-loading-skeleton/dist/skeleton.css';

type ConfirmModalProps = {
  show: boolean;
  close: () => void;
  title: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmButtonText: string;
  isPositive?: boolean;
  children: ReactNode;
  loading: boolean;
};

const ConfirmModal = ({
  show,
  close,
  title,
  onConfirm,
  onCancel,
  confirmButtonText,
  isPositive = true,
  children,
  loading = false,
}: ConfirmModalProps) => {
  return (
    <ModalWrapper
      show={show}
      close={close}
      children={
        <div className="z-30 h-fit w-[500px] rounded-lg bg-white p-8 shadow-lg">
          <div className="text-2xl font-bold">{title}</div>
          <div className="mt-4">{children}</div>
          {!loading ? (
            <div className="mt-8 flex flex-row items-center justify-end space-x-4">
              <div className="w-28">
                <Button
                  onClick={onCancel}
                  theme="neutral"
                  variant="outlined"
                  width="full"
                  isLoading={loading}
                >
                  Cancel
                </Button>
              </div>
              <div className="w-28">
                <Button
                  onClick={onConfirm}
                  theme={isPositive ? 'primary' : 'danger'}
                  variant="contained"
                  width="full"
                  isLoading={loading}
                >
                  {confirmButtonText}
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-row justify-end">
              <Skeleton className="mt-8 flex flex-row" width={100} />
            </div>
          )}
        </div>
      }
    />
  );
};
export default ConfirmModal;
