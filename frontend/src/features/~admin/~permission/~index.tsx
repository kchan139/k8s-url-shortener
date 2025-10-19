import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { toast } from 'react-toastify';

import ConfirmModal from '@/components/ui/confirm-modal/confirm-modal';
import Footer from '@/components/ui/footer';
import Header from '@/components/ui/header';
import Section from '@/components/ui/section-wrapper';
import PermissionList from '@/features/components/permission-list';
import PermissionService from '@/services/permission.service';

export const Route = createFileRoute('/admin/permission/')({
  component: RouteComponent,
});

function RouteComponent() {
  return AdminPermissionDashboard();
}

function AdminPermissionDashboard() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const onClickOpenCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const onClickCreatePermission = async () => {
    setLoading(true);
    try {
      await PermissionService.createPermission(editedName, editedDescription);
      window.location.reload();
    } catch (err) {
      console.error(err);
      toast.error('Failed to create permission');
    } finally {
      setLoading(false);
      setIsCreateModalOpen(false);
    }
  };

  const onClickCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const onClickOpenEditModal = (name: string, description: string) => {
    setIsEditModalOpen(true);
    setEditedName(name);
    setEditedDescription(description);
  };

  const onClickCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  const onClickEditPermission = async () => {
    setLoading(true);
    try {
      await PermissionService.updatePermission(editedName, editedDescription);
      window.location.reload();
    } catch (err) {
      console.error(err);
      toast.error('Failed to update permission');
    } finally {
      setLoading(false);
      setIsEditModalOpen(false);
    }
  };

  const onChangePermissionName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedName(e.target.value);
  };

  const onChangePermissionDescription = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setEditedDescription(e.target.value);
  };

  const onClickOpenDeleteModal = (name: string) => {
    setEditedName(name);
    setIsDeleteModalOpen(true);
  };

  const onClickCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const onClickDeletePermission = async () => {
    setLoading(true);
    try {
      await PermissionService.deletePermission(editedName);
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
        title="Delete Permission"
        onConfirm={onClickDeletePermission}
        onCancel={onClickCloseDeleteModal}
        confirmButtonText="Delete"
        isPositive={false}
        loading={loading}
        children={
          <div className="flex flex-col gap-4">
            <p>
              The permission will be deleted forever and can no longer be
              accessed by any means!
            </p>
          </div>
        }
      />

      <ConfirmModal
        show={isCreateModalOpen}
        close={onClickCloseCreateModal}
        title="Create Permission"
        onConfirm={onClickCreatePermission}
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
                    onChange={onChangePermissionName}
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
                    onChange={onChangePermissionDescription}
                    placeholder="Description"
                    value={editedDescription}
                    className="w-full rounded border border-solid p-3 focus:border-primary"
                  />
                </form>
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
        title="Edit Permission"
        onConfirm={onClickEditPermission}
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
                    onChange={onChangePermissionName}
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
                    onChange={onChangePermissionDescription}
                    placeholder="Description"
                    value={editedDescription}
                    className="w-full rounded border border-solid p-3 focus:border-primary"
                  />
                </form>
              </>
            ) : (
              <>
                <Skeleton className="w-full rounded border border-solid p-3" />
                <Skeleton className="w-full rounded border border-solid p-3" />
              </>
            )}
            <p>This action can not be be reversed! </p>
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
        <PermissionList
          onClickOpenModal={onClickOpenDeleteModal}
          onClickOpenEditModal={onClickOpenEditModal}
        />
      </Section>
      <Footer />
    </div>
  );
}
