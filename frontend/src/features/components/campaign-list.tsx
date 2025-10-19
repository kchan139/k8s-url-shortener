import { Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';

import CampaignService from '@/services/campaign.service';
import useAuthStore from '@/store/use-auth-store';
import { Campaign } from '@/types/campaign';
import { DEFAULT_PAGE_SIZE } from '@/utils/constants';

import Pagination from './pagination';

import 'react-loading-skeleton/dist/skeleton.css';

type CampaignListProps = {
  onClickOpenModal: (name: string) => void;
  onClickOpenEditModal: (
    name: string,
    description: string,
    endDate: string,
    id: string,
  ) => void;
};

const CampaignList = ({
  onClickOpenModal,
  onClickOpenEditModal,
}: CampaignListProps) => {
  const [page, setPage] = useState(1);
  const [pageAmount, setPageAmount] = useState(1);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(false);

  const { user } = useAuthStore();

  useEffect(() => {
    const fetchCampaignList = async () => {
      setLoading(true);
      try {
        const res = await CampaignService.getAllCampaigns(user?.id ?? '', page);
        setCampaigns(res.data.items);
        setPageAmount(Math.ceil(res.data.records / DEFAULT_PAGE_SIZE));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaignList();
  }, [page, user]);

  return (
    <>
      <div className="w-full overflow-hidden rounded-lg">
        <div className="grid h-16 w-full grid-cols-12 gap-4 bg-primary text-xl font-bold text-white">
          <div className="flex flex-row items-center justify-center">#</div>
          <div className="col-span-2 flex flex-row items-center justify-start">
            Campaign Name
          </div>
          <div className="col-span-3 flex flex-row items-center justify-start">
            Campaign Description
          </div>
          <div className="col-span-2 flex flex-row items-center justify-start">
            Start Date
          </div>
          <div className="col-span-2 flex flex-row items-center justify-start">
            End Date
          </div>
          <div className="col-span-2 flex flex-row items-center justify-center">
            Actions
          </div>
        </div>
        {!loading
          ? campaigns.map((campaign, index) => (
              <div
                className="grid h-16 w-full grid-cols-12 gap-4 border-b bg-white transition-all duration-100 hover:bg-slate-100"
                key={index}
              >
                <div className="flex flex-row items-center justify-center">
                  {(page - 1) * 10 + index + 1}
                </div>
                <Link
                  to={`/campaign/${campaign.id}`}
                  className="col-span-2 flex flex-row items-center justify-start hover:underline"
                >
                  {campaign.name}
                </Link>
                <div className="col-span-3 flex flex-row items-center justify-start">
                  {campaign.description}
                </div>
                <div className="col-span-2 flex flex-row items-center justify-start">
                  {new Date(campaign.startDate).toLocaleDateString()}
                </div>
                <div className="col-span-2 flex flex-row items-center justify-start">
                  {new Date(campaign.endDate).toLocaleDateString()}
                </div>
                <div className="col-span-2 flex flex-row items-center justify-center space-x-2">
                  <button
                    onClick={() => {
                      console.log('haha', campaign.id);
                      onClickOpenEditModal(
                        campaign.name,
                        campaign.description,
                        campaign.endDate,
                        campaign.id,
                      );
                    }}
                  >
                    <img
                      src="/icons/pencil.svg"
                      alt="edit-button"
                      className="h-7 w-auto"
                    />
                  </button>
                  <button onClick={() => onClickOpenModal(campaign.id)}>
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
                <div className="col-span-2 flex flex-row items-center justify-start">
                  <Skeleton width={200} />
                </div>
                <div className="col-span-3 flex flex-row items-center justify-start">
                  <Skeleton width={300} />
                </div>
                <div className="col-span-2 flex flex-row items-center justify-start">
                  <Skeleton width={200} />
                </div>
                <div className="col-span-2 flex flex-row items-center justify-start">
                  <Skeleton width={200} />
                </div>
                <div className="col-span-2 flex flex-row items-center justify-center">
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

export default CampaignList;
