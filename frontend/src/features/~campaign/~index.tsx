import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { toast } from 'react-toastify';

import ConfirmModal from '@/components/ui/confirm-modal/confirm-modal';
import Footer from '@/components/ui/footer';
import Header from '@/components/ui/header';
import Section from '@/components/ui/section-wrapper';
import CampaignService from '@/services/campaign.service';
import useAuthStore from '@/store/use-auth-store';

import CampaignList from '../components/campaign-list';

export const Route = createFileRoute('/campaign/')({
  component: CampaignDashboard,
});

function CampaignDashboard() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [campaignId, setCampaignId] = useState('');
  const [editedName, setEditedName] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [editedEndDate, setEditedEndDate] = useState('');

  const { user } = useAuthStore();

  const onClickOpenCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const onClickCreateCampaign = async () => {
    setLoading(true);
    try {
      await CampaignService.createCampaign(
        user?.id ?? '',
        editedName,
        editedEndDate,
        editedDescription,
      );
      window.location.reload();
    } catch (err) {
      console.error(err);
      toast.error('Failed to create campaign');
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
    endDate: string,
    id: string,
  ) => {
    setIsEditModalOpen(true);
    setEditedName(name);
    setEditedDescription(description);
    setEditedEndDate(endDate);
    setCampaignId(id);
  };

  const onClickCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  const onClickEditCampaign = async () => {
    setLoading(true);
    try {
      await CampaignService.updateCampaign(
        user?.id ?? '',
        campaignId,
        editedName,
        editedEndDate,
        editedDescription,
      );
      window.location.reload();
    } catch (err) {
      console.error(err);
      toast.error('Failed to update campaign');
    } finally {
      setLoading(false);
      setIsEditModalOpen(false);
    }
  };

  const onChangeCampaignName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedName(e.target.value);
  };

  const onChangeCampaignDescription = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setEditedDescription(e.target.value);
  };

  const onChangeCampaignEndDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedEndDate(e.target.value);
  };

  const onClickOpenDeleteModal = (campaignId: string) => {
    setCampaignId(campaignId);
    setIsDeleteModalOpen(true);
  };

  const onClickCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const onClickDeleteCampaign = async () => {
    setLoading(true);
    try {
      await CampaignService.deleteCampaign(user?.id ?? '', campaignId);
      window.location.reload();
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete campaign');
    } finally {
      setLoading(false);
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <div className="relative flex w-full flex-col">
      <ConfirmModal
        show={isDeleteModalOpen}
        close={onClickCloseDeleteModal}
        title="Delete Campaign"
        onConfirm={onClickDeleteCampaign}
        onCancel={onClickCloseDeleteModal}
        confirmButtonText="Delete"
        isPositive={false}
        loading={loading}
        children={
          <div className="flex flex-col gap-4">
            <p>
              The campaign will be deleted forever and can no longer be accessed
              by any means!
            </p>
          </div>
        }
      />

      <ConfirmModal
        show={isCreateModalOpen}
        close={onClickCloseCreateModal}
        title="Create Campaign"
        onConfirm={onClickCreateCampaign}
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
                    onChange={onChangeCampaignName}
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
                    onChange={onChangeCampaignDescription}
                    placeholder="Description"
                    value={editedDescription}
                    className="w-full rounded border border-solid p-3 focus:border-primary"
                  />
                </form>

                <form>
                  <input
                    id="email"
                    name="email"
                    type="text"
                    onChange={onChangeCampaignEndDate}
                    placeholder="End Date"
                    value={editedEndDate}
                    className="w-full rounded border border-solid p-3 focus:border-primary"
                  />
                </form>
              </>
            ) : (
              <>
                <Skeleton className="w-full rounded border border-solid p-3" />
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
        title="Edit Campaign"
        onConfirm={onClickEditCampaign}
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
                    onChange={onChangeCampaignName}
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
                    onChange={onChangeCampaignDescription}
                    placeholder="Description"
                    value={editedDescription}
                    className="w-full rounded border border-solid p-3 focus:border-primary"
                  />
                </form>

                <form>
                  <input
                    id="email"
                    name="email"
                    type="text"
                    onChange={onChangeCampaignEndDate}
                    placeholder="End Date"
                    value={editedEndDate}
                    className="w-full rounded border border-solid p-3 focus:border-primary"
                  />
                </form>
              </>
            ) : (
              <>
                <Skeleton className="w-full rounded border border-solid p-3" />
                <Skeleton className="w-full rounded border border-solid p-3" />
                <Skeleton className="w-full rounded border border-solid p-3" />
              </>
            )}
            <p>This action can not be be reversed! </p>
          </div>
        }
      />
      <img
        alt="Background"
        src="/images/background-statistics.png"
        className="absolute h-screen object-cover object-center lg:w-screen"
      />
      <Header />

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
        <CampaignList
          onClickOpenModal={onClickOpenDeleteModal}
          onClickOpenEditModal={onClickOpenEditModal}
        />
      </Section>
      <Footer />
    </div>
  );
}
