import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { toast } from 'react-toastify';

import ConfirmModal from '@/components/ui/confirm-modal/confirm-modal';
import Footer from '@/components/ui/footer';
import Header from '@/components/ui/header';
import Section from '@/components/ui/section-wrapper';
import UserList from '@/features/components/user-list';
import RoleService from '@/services/role.service';
import UserService from '@/services/user.service';
import { Role } from '@/types/auth';
import { DEFAULT_PAGE_SIZE } from '@/utils/constants';

export const Route = createFileRoute('/admin/user/')({
  component: AdminUserDashboard,
});

function AdminUserDashboard() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState('');
  const [editedFirstName, setEditedFirstName] = useState('');
  const [editedLastName, setEditedLastName] = useState('');
  const [editedRoles, setEditedRoles] = useState<string[]>([]);

  const [roles, setRoles] = useState<Role[]>([]);
  const [rolePage, setRolePage] = useState(1);
  const [roleLoading, setRoleLoading] = useState(false);
  const [rolePageAmount, setRolePageAmount] = useState(1);

  useEffect(() => {
    const fetchRoleList = async () => {
      setRoleLoading(true);
      try {
        const res = await RoleService.getRoles(rolePage);
        setRoles(res.data.items);
        setRolePageAmount(Math.ceil(res.data.records / DEFAULT_PAGE_SIZE));
      } catch (err) {
        console.error(err);
      } finally {
        setRoleLoading(false);
      }
    };

    fetchRoleList();
  }, [rolePage]);

  const onClickOpenEditModal = (
    userId: string,
    firstname: string,
    lastname: string,
    roles: string[],
  ) => {
    setIsEditModalOpen(true);
    setUserId(userId);
    setEditedFirstName(firstname);
    setEditedLastName(lastname);
    setEditedRoles(roles);
    setRolePage(1);
  };

  const onClickCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  const onClickEditUser = async () => {
    setLoading(true);
    try {
      await UserService.updateUser(
        userId,
        editedFirstName,
        editedLastName,
        editedRoles,
      );
      window.location.reload();
    } catch (err) {
      console.error(err);
      toast.error('Failed to update user');
    } finally {
      setLoading(false);
      setIsEditModalOpen(false);
    }
  };

  const onChangeRoleFirstName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedFirstName(e.target.value);
  };

  const onChangeRoleLastName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedLastName(e.target.value);
  };

  const onClickOpenDeleteModal = (userId: string) => {
    setUserId(userId);
    setIsDeleteModalOpen(true);
  };

  const onClickCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const onClickDeleteRole = async () => {
    setLoading(true);
    try {
      await UserService.deleteUser(userId);
      window.location.reload();
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete user');
    } finally {
      setLoading(false);
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <div className="relative flex w-full flex-col">
      <Header />
      <ConfirmModal
        show={isDeleteModalOpen}
        close={onClickCloseDeleteModal}
        title="Delete User"
        onConfirm={onClickDeleteRole}
        onCancel={onClickCloseDeleteModal}
        confirmButtonText="Delete"
        isPositive={false}
        loading={loading}
        children={
          <div className="flex flex-col gap-4">
            <p>
              The user will be deleted forever and can no longer be accessed by
              any means!
            </p>
          </div>
        }
      />

      <ConfirmModal
        show={isEditModalOpen}
        close={onClickCloseEditModal}
        title="Edit Role"
        onConfirm={onClickEditUser}
        onCancel={onClickCloseEditModal}
        confirmButtonText="Confirm"
        isPositive={true}
        loading={loading}
        children={
          <div className="flex flex-col gap-4">
            {!loading ? (
              <>
                <form>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    onChange={onChangeRoleFirstName}
                    placeholder="First Name"
                    value={editedFirstName}
                    className="w-full rounded border border-solid p-3 focus:border-primary"
                  />
                </form>

                <form>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    onChange={onChangeRoleLastName}
                    placeholder="Last Name"
                    value={editedLastName}
                    className="w-full rounded border border-solid p-3 focus:border-primary"
                  />
                </form>

                <div className="mt-4 flex h-max w-full flex-col">
                  <div className="flex flex-row justify-between">
                    <h1 className="text-lg font-bold">Permissions</h1>
                    <div className="flex flex-row">
                      <button
                        className="ml-2 rounded border border-primary px-2 py-1 text-primary disabled:opacity-50"
                        onClick={() =>
                          setRolePage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={rolePage === 1}
                      >
                        <img
                          src="/icons/chevron.svg"
                          alt="chevron-right"
                          className="h-6 w-auto lg:h-5"
                        />
                      </button>
                      <button
                        className="ml-1 rounded border border-primary px-2 py-1 text-primary disabled:opacity-50"
                        onClick={() => setRolePage((prev) => prev + 1)}
                        disabled={rolePage === rolePageAmount}
                      >
                        <img
                          src="/icons/chevron.svg"
                          alt="chevron-right"
                          className="h-6 w-auto rotate-180 lg:h-5"
                        />
                      </button>
                    </div>
                  </div>
                  <div className="mt-4 grid size-full grid-cols-2 gap-4">
                    {!roleLoading
                      ? roles.map((role, index) => (
                          <div
                            className="flex flex-row items-center justify-start rounded-md border p-2"
                            key={index}
                          >
                            <input
                              type="checkbox"
                              id={role.name}
                              name={role.name}
                              value={role.name}
                              className="mr-2 size-4 rounded border-gray-300 text-primary focus:ring-primary"
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setEditedRoles((prev) => [
                                    ...prev,
                                    role.name,
                                  ]);
                                } else {
                                  setEditedRoles((prev) =>
                                    prev.filter((r) => r !== role.name),
                                  );
                                }
                              }}
                              checked={editedRoles.includes(role.name)}
                            />
                            <label
                              htmlFor={role.name}
                              className="text-sm font-medium text-gray-700"
                            >
                              {role.name}
                            </label>
                          </div>
                        ))
                      : Array.from({ length: 10 }, () => (
                          <Skeleton className="flex flex-row items-center justify-start rounded-md p-2" />
                        ))}
                  </div>
                </div>
              </>
            ) : (
              <>
                <Skeleton className="w-full rounded border border-solid p-3" />
                <Skeleton className="w-full rounded border border-solid p-3" />
              </>
            )}
          </div>
        }
      />

      <Section>
        <UserList
          onClickOpenModal={onClickOpenDeleteModal}
          onClickOpenEditModal={onClickOpenEditModal}
        />
      </Section>
      <Footer />
    </div>
  );
}
