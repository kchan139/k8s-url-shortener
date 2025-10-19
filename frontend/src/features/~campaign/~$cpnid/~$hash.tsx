import { createFileRoute } from '@tanstack/react-router';
import { useCallback, useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { toast } from 'react-toastify';

import Footer from '@/components/ui/footer';
import Header from '@/components/ui/header';
import Section from '@/components/ui/section-wrapper';
import Pagination from '@/features/components/pagination';
import { toDateTimeWithSlashes } from '@/helpers/date-converter';
import { handleAxiosError } from '@/helpers/handle-axios-error';
import UrlsService from '@/services/urls.service';
import useAuthStore from '@/store/use-auth-store';

export const Route = createFileRoute('/campaign/$cpnid/$hash')({
  component: RouteComponent,
});

function RouteComponent() {
  const { user } = useAuthStore();
  const { cpnid, hash } = Route.useParams();
  const [clicks, setClicks] = useState<
    Array<{
      clickedAt: string;
      platform: string;
      userAgent: string;
    }>
  >([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [records, setRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const size = 10;

  const getAllUrls = useCallback(async () => {
    try {
      setLoading(true);
      if (!user?.id) {
        toast.error('No user at the moment. Please login!');
        setLoading(false);
        return;
      }
      const { data } = await UrlsService.getAllUrlClicksCampaign(
        user?.id,
        cpnid,
        hash,
        page,
        size,
      );
      setTotalPages(data.totalPages);
      setRecords(data.records);
      setClicks(data.items);
    } catch (error: unknown) {
      handleAxiosError(
        error,
        (message) => toast.error(message),
        'Can not shorten URL!',
      );
    } finally {
      setLoading(false);
    }
  }, [page, size, user?.id, cpnid, hash]);

  useEffect(() => {
    getAllUrls();
  }, [getAllUrls]);

  return (
    <div className="relative flex w-full flex-col">
      <img
        alt="Background"
        src="/images/background-statistics.png"
        className="absolute h-screen object-cover object-center lg:w-screen"
      />
      <Header />
      <Section>
        <div className="relative flex w-full flex-row items-center justify-between">
          <div className="text-[24px] font-bold text-white">
            {hash} (URL hash)
          </div>
          <div className=" text-white">
            {' '}
            <span className="font-bold">Total Clicks:</span> {records}
          </div>
        </div>
        <div className="mt-5 w-full overflow-hidden rounded-lg">
          <div className="grid h-16 w-full grid-cols-12 gap-4 bg-primary text-xl font-bold text-white">
            <div className="flex flex-row items-center justify-center">#</div>
            <div className="col-span-3 flex flex-row items-center justify-start">
              Clicked at
            </div>
            <div className="col-span-2 flex flex-row items-center justify-start">
              Platform
            </div>
            <div className="col-span-5 flex flex-row items-center justify-center">
              User Agent
            </div>
          </div>
          {clicks.map((click, index) => (
            <div
              className="grid h-16 w-full grid-cols-12 gap-4 border-b bg-white transition-all duration-100 hover:bg-slate-100"
              key={click.clickedAt}
            >
              <div className="flex flex-row items-center justify-center">
                {index + 1}
              </div>
              <div className="col-span-3 flex flex-row items-center justify-start truncate">
                {toDateTimeWithSlashes(new Date(click.clickedAt))}
              </div>
              <div className="col-span-2 flex flex-row items-center justify-start overflow-hidden truncate whitespace-nowrap">
                {click.platform}
              </div>
              <div className="col-span-5 flex flex-row items-center justify-start overflow-hidden truncate whitespace-nowrap">
                {click.userAgent}
              </div>
            </div>
          ))}

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
        </div>
      </Section>
      <Footer />
    </div>
  );
}
