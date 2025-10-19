import { useNavigate } from '@tanstack/react-router';
import Skeleton from 'react-loading-skeleton';
import { toast } from 'react-toastify';

import { Button } from '@/components/ui/button';
import Section from '@/components/ui/section-wrapper';
import Pagination from '@/features/components/pagination';
import { toDateWithSlashes } from '@/helpers/date-converter';
import { ShortenedUrl } from '@/types/url';

type UrlListProps = {
  campaignId?: string;
  urlsList: Array<ShortenedUrl>;
  loading: boolean;
  page: number;
  totalPages: number;
  setPage: (page: number) => void;
  onClickOpenQrModal: (url: string) => void;
  onClickOpenModal: (hash: string) => void;
  onClickOpenEditModal: (hash: string) => void;
  onClickOpenShortenModal: () => void;
};

const UrlList = ({
  campaignId,
  urlsList,
  loading,
  page,
  totalPages,
  setPage,
  onClickOpenQrModal,
  onClickOpenModal,
  onClickOpenEditModal,
  onClickOpenShortenModal,
}: UrlListProps) => {
  const navigate = useNavigate();
  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);

    toast.success('URL has been copied to clipboard!');
  };

  return (
    <Section className="flex flex-col items-center gap-5">
      <div className="relative flex w-full flex-row items-center justify-between text-[24px] font-bold text-white">
        <div>Manage URLs</div>
        <Button onClick={onClickOpenShortenModal} className="">
          Shorten URL
        </Button>
      </div>
      <div className="w-full overflow-hidden rounded-lg">
        <div className="grid h-16 w-full grid-cols-12 gap-4 bg-primary text-xl font-bold text-white">
          <div className="flex flex-row items-center justify-center">#</div>
          <div className="col-span-2 flex flex-row items-center justify-start">
            Original Link
          </div>
          <div className="col-span-2 flex flex-row items-center justify-start">
            Shortened Link
          </div>
          <div className="col-span-1 flex flex-row items-center justify-start">
            Views
          </div>
          <div className="col-span-2 flex flex-row items-center justify-start">
            Created On
          </div>
          <div className="col-span-2 flex flex-row items-center justify-start">
            Expired On
          </div>
          <div className="col-span-2 flex flex-row items-center justify-center">
            Actions
          </div>
        </div>
        {urlsList.map((shortenedUrl, index) => (
          <div
            className={`${shortenedUrl.deleted ? 'opacity-50' : 'hover:bg-slate-100'} grid h-16 w-full grid-cols-12 gap-4 border-b bg-white transition-all duration-100 `}
            key={shortenedUrl.hash}
          >
            <div className="flex flex-row items-center justify-center">
              {index + 1}
            </div>
            <div className="col-span-2 flex flex-row items-center justify-start truncate">
              {shortenedUrl.longUrl}
            </div>
            <div className="col-span-2 flex flex-row items-center justify-start overflow-hidden truncate whitespace-nowrap">
              {`https://url-shortener-be-production-aa52.up.railway.app/${shortenedUrl?.hash}?r=Facebook`}
            </div>
            <div className="col-span-1 flex flex-row items-center justify-start">
              {shortenedUrl.clickCount}
            </div>
            <div className="col-span-2 flex flex-row items-center justify-start">
              {toDateWithSlashes(new Date(shortenedUrl.createdAt))}
            </div>
            <div className="col-span-2 flex flex-row items-center justify-start">
              {toDateWithSlashes(new Date(shortenedUrl.expiresAt))}
            </div>
            <div className="col-span-2 flex flex-row items-center justify-center space-x-2">
              {!shortenedUrl.deleted ? (
                <>
                  {campaignId && (
                    <button
                      onClick={() => {
                        navigate({
                          to: `/campaign/${campaignId}/${shortenedUrl.hash}`,
                        });
                      }}
                    >
                      <img
                        src="/icons/info.svg"
                        alt="info-button"
                        className="mr-2 size-5"
                      />
                    </button>
                  )}
                  <button
                    onClick={() => {
                      onClickOpenQrModal(
                        `https://url-shortener-be-production-aa52.up.railway.app/${shortenedUrl?.hash}?r=Facebook`,
                      );
                    }}
                  >
                    <img
                      src="/icons/gen-qr.svg"
                      alt="generate-qr-button"
                      className="mr-2 size-5"
                    />
                  </button>
                  <button
                    onClick={() => {
                      copyUrl(
                        `https://url-shortener-be-production-aa52.up.railway.app/${shortenedUrl?.hash}?r=Facebook`,
                      );
                    }}
                  >
                    <img
                      src="/icons/copy.svg"
                      alt="copy-button"
                      className="h-7 w-auto"
                    />
                  </button>
                  <button
                    onClick={() => {
                      onClickOpenEditModal(shortenedUrl.hash);
                    }}
                  >
                    <img
                      src="/icons/pencil.svg"
                      alt="edit-button"
                      className="h-7 w-auto"
                    />
                  </button>
                  <button onClick={() => onClickOpenModal(shortenedUrl.hash)}>
                    <img
                      src="/icons/trash.svg"
                      alt="delete-button"
                      className="h-7 w-auto"
                    />
                  </button>
                </>
              ) : (
                <div className="font-bold text-red">DELETED</div>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-10 flex w-full flex-row justify-end">
        {!loading ? (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        ) : (
          <div className="flex flex-row justify-end">
            <Skeleton className="mt-8 flex flex-row" width={100} />
          </div>
        )}
      </div>
    </Section>
  );
};

export default UrlList;
