import { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';

import PermissionService from '@/services/permission.service';
import { Permission } from '@/types/auth';
import { DEFAULT_PAGE_SIZE } from '@/utils/constants';

import Pagination from './pagination';
import 'react-loading-skeleton/dist/skeleton.css';

type PermissionListProps = {
  onClickOpenModal: (name: string) => void;
  onClickOpenEditModal: (name: string, description: string) => void;
};

const PermissionList = ({
  onClickOpenModal,
  onClickOpenEditModal,
}: PermissionListProps) => {
  const [page, setPage] = useState(1);
  const [pageAmount, setPageAmount] = useState(1);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPermissionList = async () => {
      setLoading(true);
      try {
        const res = await PermissionService.getPermissions(page);
        setPermissions(res.data.items);
        setPageAmount(Math.ceil(res.data.records / DEFAULT_PAGE_SIZE));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPermissionList();
  }, [page]);

  return (
    <>
      <div className="w-full overflow-hidden rounded-lg">
        <div className="grid h-16 w-full grid-cols-12 gap-4 bg-primary text-xl font-bold text-white">
          <div className="flex flex-row items-center justify-center">#</div>
          <div className="col-span-5 flex flex-row items-center justify-start">
            Permission Name
          </div>
          <div className="col-span-4 flex flex-row items-center justify-start">
            Permission Description
          </div>
          <div className="col-span-2 flex flex-row items-center justify-center">
            Actions
          </div>
        </div>
        {!loading
          ? permissions.map((permission, index) => (
              <div
                className="grid h-16 w-full grid-cols-12 gap-4 border-b bg-white transition-all duration-100 hover:bg-slate-100"
                key={index}
              >
                <div className="flex flex-row items-center justify-center">
                  {(page - 1) * 10 + index + 1}
                </div>
                <div className="col-span-5 flex flex-row items-center justify-start">
                  {permission.name}
                </div>
                <div className="col-span-4 flex flex-row items-center justify-start">
                  {permission.description}
                </div>
                <div className="col-span-2 flex flex-row items-center justify-center space-x-2">
                  <button
                    onClick={() =>
                      onClickOpenEditModal(
                        permission.name,
                        permission.description,
                      )
                    }
                  >
                    <img
                      src="/icons/pencil.svg"
                      alt="edit-button"
                      className="h-7 w-auto"
                    />
                  </button>
                  <button onClick={() => onClickOpenModal(permission.name)}>
                    <img
                      src="/icons/trash.svg"
                      alt="delete-button"
                      className="h-7 w-auto"
                    />
                  </button>
                </div>
              </div>
            ))
          : Array.from({ length: 10 }, (_, index) => (
              <div
                className="grid h-16 w-full grid-cols-12 gap-4 border-b bg-white transition-all duration-100 hover:bg-slate-100"
                key={index}
              >
                <div className="flex size-full flex-row items-center justify-center">
                  <Skeleton width={40} />
                </div>
                <div className="col-span-5 flex size-full flex-row items-center justify-start">
                  <Skeleton width={300} />
                </div>
                <div className="col-span-4 flex size-full flex-row items-center justify-start">
                  <Skeleton width={300} />
                </div>
                <div className="col-span-2 flex size-full flex-row items-center justify-center">
                  <Skeleton width={100} />
                </div>
              </div>
            ))}
      </div>
      <div className="mt-10 flex w-full flex-row justify-end">
        <Pagination
          currentPage={page}
          totalPages={pageAmount}
          onPageChange={setPage}
        />
      </div>
    </>
  );
};

export default PermissionList;
