import { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';

import UserService from '@/services/user.service';
import { User } from '@/types/auth';
import { DEFAULT_PAGE_SIZE } from '@/utils/constants';

import Pagination from './pagination';

import 'react-loading-skeleton/dist/skeleton.css';

type UserListProps = {
  onClickOpenModal: (userId: string) => void;
  onClickOpenEditModal: (
    userId: string,
    firstname: string,
    lastname: string,
    roles: string[],
  ) => void;
};

const UserList = ({
  onClickOpenModal,
  onClickOpenEditModal,
}: UserListProps) => {
  const [page, setPage] = useState(1);
  const [pageAmount, setPageAmount] = useState(1);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserList = async () => {
      setLoading(true);
      try {
        const res = await UserService.getUsers(page, DEFAULT_PAGE_SIZE, false);
        setUsers(res.data.items);
        setPageAmount(Math.ceil(res.data.records / DEFAULT_PAGE_SIZE));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserList();
  }, [page]);

  return (
    <>
      <div className="w-full overflow-hidden rounded-lg">
        <div className="grid h-16 w-full grid-cols-12 gap-4 bg-primary text-xl font-bold text-white">
          <div className="flex flex-row items-center justify-center">#</div>
          <div className="col-span-5 flex flex-row items-center justify-start">
            Fullname
          </div>
          <div className="col-span-4 flex flex-row items-center justify-start">
            Email
          </div>
          <div className="col-span-2 flex flex-row items-center justify-center">
            Actions
          </div>
        </div>
        {!loading
          ? users.map((user, index) => (
              <div
                className="grid h-16 w-full grid-cols-12 gap-4 border-b bg-white transition-all duration-100 hover:bg-slate-100"
                key={index}
              >
                <div className="flex flex-row items-center justify-center">
                  {(page - 1) * 10 + index + 1}
                </div>
                <div className="col-span-5 flex flex-row items-center justify-start">
                  {user.firstName} {user.lastName}
                </div>
                <div className="col-span-4 flex flex-row items-center justify-start">
                  {user.email}
                </div>
                <div className="col-span-2 flex flex-row items-center justify-center space-x-2">
                  <button
                    onClick={() =>
                      onClickOpenEditModal(
                        user.id,
                        user.firstName,
                        user.lastName,
                        user.roles.map((role) => role.name),
                      )
                    }
                  >
                    <img
                      src="/icons/pencil.svg"
                      alt="edit-button"
                      className="h-7 w-auto"
                    />
                  </button>
                  <button onClick={() => onClickOpenModal(user.id)}>
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

export default UserList;
