import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { toast } from 'react-toastify';

import ConfirmModal from '@/components/ui/confirm-modal/confirm-modal';
import Footer from '@/components/ui/footer';
import Header from '@/components/ui/header';
import Section from '@/components/ui/section-wrapper';
import RoleList from '@/features/components/role-list';
import PermissionService from '@/services/permission.service';
import RoleService from '@/services/role.service';
import { Permission } from '@/types/auth';
import { DEFAULT_PAGE_SIZE } from '@/utils/constants';

export const Route = createFileRoute('/admin/role/')({
  component: AdminRoleDashboard,
});

function AdminRoleDashboard() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [editedPermissions, setEditedPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [permissionPage, setPermissionPage] = useState(1);
  const [permissionLoading, setPermissionLoading] = useState(false);
  const [permissionPageAmount, setPermissionPageAmount] = useState(1);

  useEffect(() => {
    const fetchPermissionList = async () => {
      setPermissionLoading(true);
      try {
        const res = await PermissionService.getPermissions(permissionPage);
        setPermissions(res.data.items);
        setPermissionPageAmount(
          Math.ceil(res.data.records / DEFAULT_PAGE_SIZE),
        );
      } catch (err) {
        console.error(err);
      } finally {
        setPermissionLoading(false);
      }
    };

    fetchPermissionList();
  }, [permissionPage]);

  const onClickOpenCreateModal = () => {
    setIsCreateModalOpen(true);
    setPermissionPage(1);
    setEditedName('');
    setEditedDescription('');
    setEditedPermissions([]);
  };

  const onClickCreateRole = async () => {
    setLoading(true);
    try {
      await RoleService.createRole(
        editedName,
        editedDescription,
        editedPermissions,
      );
      window.location.reload();
    } catch (err) {
      console.error(err);
      toast.error('Failed to create role');
    } finally {
      setLoading(false);
      setIsCreateModalOpen(false);
    }
  };

  const onClickCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const onClickOpenEditModal = (
    name: string,
    description: string,
    permissions: string[],
  ) => {
    setIsEditModalOpen(true);
    setEditedName(name);
    setEditedDescription(description);
    setEditedPermissions(permissions);
    setPermissionPage(1);
  };

  const onClickCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  const onClickEditRole = async () => {
    setLoading(true);
    try {
      await RoleService.updateRole(
        editedName,
        editedDescription,
        editedPermissions,
      );
      window.location.reload();
    } catch (err) {
      console.error(err);
      toast.error('Failed to update permission');
    } finally {
      setLoading(false);
      setIsEditModalOpen(false);
    }
  };

  const onChangeRoleName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedName(e.target.value);
  };

  const onChangeRoleDescription = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedDescription(e.target.value);
  };

  const onClickOpenDeleteModal = (name: string) => {
    setEditedName(name);
    setIsDeleteModalOpen(true);
  };

  const onClickCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const onClickDeleteRole = async () => {
    setLoading(true);
    try {
      await RoleService.deleteRole(editedName);
      window.location.reload();
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete permission');
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
        title="Delete Role"
        onConfirm={onClickDeleteRole}
        onCancel={onClickCloseDeleteModal}
        confirmButtonText="Delete"
        isPositive={false}
        loading={loading}
        children={
          <div className="flex flex-col gap-4">
            <p>
              The role will be deleted forever and can no longer be accessed by
              any means!
            </p>
          </div>
        }
      />

      <ConfirmModal
        show={isCreateModalOpen}
        close={onClickCloseCreateModal}
        title="Create Role"
        onConfirm={onClickCreateRole}
        onCancel={onClickCloseCreateModal}
        confirmButtonText="Create"
        isPositive={true}
        loading={loading}
        children={
          <div className="flex flex-col gap-4">
            {!loading ? (
              <>
                <form>
                  <input
                    id="email"
                    name="email"
                    type="text"
                    onChange={onChangeRoleName}
                    placeholder="Name"
                    value={editedName}
                    className="w-full rounded border border-solid p-3 focus:border-primary"
                  />
                </form>

                <form>
                  <input
                    id="email"
                    name="email"
                    type="text"
                    onChange={onChangeRoleDescription}
                    placeholder="Description"
                    value={editedDescription}
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
                          setPermissionPage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={permissionPage === 1}
                      >
                        <img
                          src="/icons/chevron.svg"
                          alt="chevron-right"
                          className="h-6 w-auto lg:h-5"
                        />
                      </button>
                      <button
                        className="ml-1 rounded border border-primary px-2 py-1 text-primary disabled:opacity-50"
                        onClick={() => setPermissionPage((prev) => prev + 1)}
                        disabled={permissionPage === permissionPageAmount}
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
                    {!permissionLoading
                      ? permissions.map((permission, index) => (
                          <div
                            className="flex flex-row items-center justify-start rounded-md border p-2"
                            key={index}
                          >
                            <input
                              type="checkbox"
                              id={permission.name}
                              name={permission.name}
                              value={permission.name}
                              className="mr-2 size-4 rounded border-gray-300 text-primary focus:ring-primary"
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setEditedPermissions((prev) => [
                                    ...prev,
                                    permission.name,
                                  ]);
                                } else {
                                  setEditedPermissions((prev) =>
                                    prev.filter(
                                      (perm) => perm !== permission.name,
                                    ),
                                  );
                                }
                              }}
                              checked={editedPermissions.includes(
                                permission.name,
                              )}
                            />
                            <label
                              htmlFor={permission.name}
                              className="text-sm font-medium text-gray-700"
                            >
                              {permission.name}
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

      <ConfirmModal
        show={isEditModalOpen}
        close={onClickCloseEditModal}
        title="Edit Role"
        onConfirm={onClickEditRole}
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
                    id="email"
                    name="email"
                    type="text"
                    onChange={onChangeRoleName}
                    placeholder="Name"
                    value={editedName}
                    className="w-full rounded border border-solid p-3 focus:border-primary disabled:opacity-50"
                    disabled
                  />
                </form>

                <form>
                  <input
                    id="email"
                    name="email"
                    type="text"
                    onChange={onChangeRoleDescription}
                    placeholder="Description"
                    value={editedDescription}
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
                          setPermissionPage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={permissionPage === 1}
                      >
                        <img
                          src="/icons/chevron.svg"
                          alt="chevron-right"
                          className="h-6 w-auto lg:h-5"
                        />
                      </button>
                      <button
                        className="ml-1 rounded border border-primary px-2 py-1 text-primary disabled:opacity-50"
                        onClick={() => setPermissionPage((prev) => prev + 1)}
                        disabled={permissionPage === permissionPageAmount}
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
                    {!permissionLoading
                      ? permissions.map((permission, index) => (
                          <div
                            className="flex flex-row items-center justify-start rounded-md border p-2"
                            key={index}
                          >
                            <input
                              type="checkbox"
                              id={permission.name}
                              name={permission.name}
                              value={permission.name}
                              className="mr-2 size-4 rounded border-gray-300 text-primary focus:ring-primary"
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setEditedPermissions((prev) => [
                                    ...prev,
                                    permission.name,
                                  ]);
                                } else {
                                  setEditedPermissions((prev) =>
                                    prev.filter(
                                      (perm) => perm !== permission.name,
                                    ),
                                  );
                                }
                              }}
                              checked={editedPermissions.includes(
                                permission.name,
                              )}
                            />
                            <label
                              htmlFor={permission.name}
                              className="text-sm font-medium text-gray-700"
                            >
                              {permission.name}
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

      <button
        className="fixed bottom-10 right-10 z-30 flex size-12 items-center justify-center rounded-full bg-primary text-white"
        onClick={() => onClickOpenCreateModal()}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
      </button>

      <Section>
        <RoleList
          onClickOpenModal={onClickOpenDeleteModal}
          onClickOpenEditModal={onClickOpenEditModal}
        />
      </Section>
      <Footer />
    </div>
  );
}
