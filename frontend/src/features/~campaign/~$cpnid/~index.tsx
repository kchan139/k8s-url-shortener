import { createFileRoute } from '@tanstack/react-router';
import { useFormik } from 'formik';
import * as QRCode from 'qrcode';
import { useCallback, useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import { ChartData } from '@/components/charts/bar-chart';
import ConfirmModal from '@/components/ui/confirm-modal/confirm-modal';
import Footer from '@/components/ui/footer';
import Header from '@/components/ui/header';
import ModalWrapper from '@/components/ui/modal/modal-wrapper';
import { urlRegex } from '@/data/url-data';
import { toDateWithSlashes } from '@/helpers/date-converter';
import { handleAxiosError } from '@/helpers/handle-axios-error';
import UrlsService from '@/services/urls.service';
import useAuthStore from '@/store/use-auth-store';
import { ShortenedUrl } from '@/types/url';

import CampaignStats from '../components/campaign-stats';
import UrlList from '../components/url-list';

export const Route = createFileRoute('/campaign/$cpnid/')({
  component: RouteComponent,
});

enum ShortenPhase {
  SHORTEN = 'SHORTEN',
  RESULT = 'RESULT',
  QR = 'QR',
}

function RouteComponent() {
  const { cpnid } = Route.useParams();
  const { user } = useAuthStore();
  const [qrDataUrl, setQrDataUrl] = useState<string | null>();
  const [phase, setPhase] = useState<ShortenPhase>(ShortenPhase.SHORTEN);
  const [isQrModalOpen, setQrModalOpen] = useState(false);
  const [isShortenModalOpen, setShortenModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [focusHash, setFocusHash] = useState<string | null>(null);
  const [newHash, setNewHash] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [urlsList, setUrlsList] = useState<Array<ShortenedUrl>>([]);
  const [loading, setLoading] = useState(false);
  const size = 10;
  const [chartData, setChartData] = useState<ChartData>({
    title: '',
    dataValues: [],
    dataLabels: [],
    dataColors: [],
  });
  const [totalClickCount, setTotalClickCount] = useState(0);
  const [totalShortenedLinks, setTotalShortenedLinks] = useState(0);
  const [shortenedUrl, setShortenedUrl] = useState<
    (ShortenedUrl & 'userId') | null
  >(null);

  const onClickOpenEditModal = (hash: string) => {
    setIsEditModalOpen(true);
    setFocusHash(hash);
  };

  const onClickCloseEditModal = () => {
    if (loading) {
      toast.error('An action is in progress ...');
      return;
    }
    setIsEditModalOpen(false);
    setNewHash('');
    setFocusHash(null);
  };

  const onChangeUrl = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewHash(e.target.value);
  };

  const onClickOpenDeleteModal = (hash: string) => {
    setFocusHash(hash);
    setIsDeleteModalOpen(true);
  };

  const onClickCloseDeleteModal = () => {
    if (loading) {
      toast.error('An action is in progress ...');
      return;
    }
    setIsDeleteModalOpen(false);
    setFocusHash(null);
  };

  const generateQrDataUrl = (url: string) => {
    QRCode.toDataURL(
      url,
      {
        errorCorrectionLevel: 'H',
        type: 'image/png',
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      },
      (error, dataUrl) => {
        if (error) return;

        setQrDataUrl(dataUrl);
      },
    );
  };

  const downloadQr = () => {
    if (!qrDataUrl || !focusHash) {
      toast.error('There is no QR to download!');
      return;
    }

    const link = document.createElement('a');
    link.download = `bklink-${focusHash}.png`;
    link.href = qrDataUrl;
    link.click();
    document.removeChild(link);
  };

  const onClickOpenQrModal = (url: string) => {
    if (loading) {
      toast.error('An action is in progress ...');
      return;
    }
    generateQrDataUrl(url);
    setFocusHash(url);
    setQrModalOpen(true);
  };

  const onClickCloseQrModal = () => {
    if (loading) {
      toast.error('An action is in progress ...');
      return;
    }

    setQrModalOpen(false);
    setFocusHash(null);
    setQrDataUrl(null);
  };

  const onClickOpenShortenModal = () => {
    if (loading) {
      toast.error('An action is in progress ...');
      return;
    }
    setShortenModalOpen(true);
  };

  const onClickCloseShortenModal = () => {
    if (loading) {
      toast.error('An action is in progress ...');
      return;
    }
    setPhase(ShortenPhase.SHORTEN);
    setShortenModalOpen(false);
  };

  const copyUrl = () => {
    const urlElement = document.getElementById(
      'shortenedUrl',
    ) as HTMLDivElement | null;
    if (!urlElement) return;

    const url = urlElement.innerHTML;

    navigator.clipboard.writeText(url);

    toast.success('URL has been copied to clipboard!');
  };

  const shortenUrl = async (longUrl: string, alias?: string) => {
    try {
      setLoading(true);
      if (!user?.id) {
        toast.error('No user at the moment. Please login!');
        setLoading(false);
        return;
      }
      const { data } = await UrlsService.createUrlCampaign(
        user.id,
        cpnid,
        longUrl,
        alias,
      );
      setShortenedUrl(data);
      await getAllUrls();
      toast.success('URL has been shortened successfully');
      setPhase(ShortenPhase.RESULT);
    } catch (error: unknown) {
      handleAxiosError(
        error,
        (message) => toast.error(message),
        'Can not shorten URL!',
      );
    } finally {
      setLoading(false);
    }
  };

  const getCampaignStats = useCallback(async () => {
    try {
      setLoading(true);
      if (!user?.id) {
        toast.error('No user at the moment. Please login!');
        setLoading(false);
        return;
      }
      const { data } = await UrlsService.getCampaignStats(user?.id, cpnid);

      setTotalClickCount(data.totalClickCount);
      setTotalShortenedLinks(data.totalShortenedLinks);
    } catch (error: unknown) {
      handleAxiosError(
        error,
        (message) => toast.error(message),
        'Can not fetch URLs!',
      );
    } finally {
      setLoading(false);
    }
  }, [user?.id, cpnid]);

  const getFirstFiveUrls = useCallback(async () => {
    try {
      setLoading(true);
      if (!user?.id) {
        toast.error('No user at the moment. Please login!');
        setLoading(false);
        return;
      }
      const { data } = await UrlsService.getAllUrlsCampaign(
        user?.id,
        cpnid,
        'non_deleted',
        1,
        5,
      );
      const dataValues = data.items.map(
        (shortenedUrl) => shortenedUrl.clickCount,
      );
      const dataLabels = data.items.map((shortenedUrl) => shortenedUrl.hash);
      const dataColors = data.items.map(() => '#B1BDDD');
      setChartData({
        title: '',
        dataValues,
        dataLabels,
        dataColors,
      });
    } catch (error: unknown) {
      handleAxiosError(
        error,
        (message) => toast.error(message),
        'Can not fetch URLs!',
      );
    } finally {
      setLoading(false);
    }
  }, [user?.id, cpnid]);

  const getAllUrls = useCallback(async () => {
    try {
      setLoading(true);
      if (!user?.id) {
        toast.error('No user at the moment. Please login!');
        setLoading(false);
        return;
      }
      const { data } = await UrlsService.getAllUrlsCampaign(
        user?.id,
        cpnid,
        'all',
        page,
        size,
      );
      setTotalPages(data.totalPages);
      setUrlsList(data.items);
    } catch (error: unknown) {
      handleAxiosError(
        error,
        (message) => toast.error(message),
        'Can not fetch URLs!',
      );
    } finally {
      setLoading(false);
    }
  }, [page, size, user?.id, cpnid]);

  const editAlias = async () => {
    try {
      setLoading(true);
      if (!user?.id) {
        toast.error('No user at the moment. Please login!');
        setLoading(false);
        return;
      }
      if (!focusHash) {
        toast.error('No URL selected at the moment. Please select a URL!');
        setLoading(false);
        return;
      }
      await UrlsService.updateUrlByHashCampaign(
        user.id,
        cpnid,
        focusHash,
        newHash,
      );
      await getAllUrls();
      toast.success('Url alias has been updated!');
      onClickCloseEditModal();
    } catch (error: unknown) {
      handleAxiosError(
        error,
        (message) => toast.error(message),
        'Can not update URL!',
      );
    } finally {
      setLoading(false);
    }
  };

  const deleteUrl = async () => {
    try {
      setLoading(true);
      if (!user?.id) {
        toast.error('No user at the moment. Please login!');
        setLoading(false);
        return;
      }
      if (!focusHash) {
        toast.error('No URL selected at the moment. Please select a URL!');
        setLoading(false);
        return;
      }
      await UrlsService.deleteUrlByHashCampaign(user.id, cpnid, focusHash);
      await getAllUrls();
      toast.success('Url alias has been deleted!');
      onClickCloseDeleteModal();
    } catch (error: unknown) {
      handleAxiosError(
        error,
        (message) => toast.error(message),
        'Can not delete URL!',
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllUrls();
  }, [getAllUrls]);

  useEffect(() => {
    getCampaignStats();
  }, [getCampaignStats]);

  useEffect(() => {
    getFirstFiveUrls();
  }, [getFirstFiveUrls]);

  const urlFormik = useFormik({
    initialValues: {
      longUrl: '',
      hash: '',
      // expiresAt: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
    },
    validationSchema: Yup.object({
      longUrl: Yup.string()
        .matches(urlRegex, 'The input must be a valid URL')
        .required('Please enter the long URL'),
      hash: Yup.string()
        // required('Please enter the long URL'),
        .optional(),
      // expiresAt: Yup.date().required('Expiry date must be specified'),
    }),
    onSubmit: async (value, { resetForm }) => {
      await shortenUrl(value.longUrl, value.hash);
      resetForm();
    },
  });

  return (
    <>
      <div className="relative flex flex-col">
        <Header />
        <ConfirmModal
          loading={loading}
          show={isDeleteModalOpen}
          close={onClickCloseDeleteModal}
          title="Delete URL"
          onConfirm={deleteUrl}
          onCancel={onClickCloseDeleteModal}
          confirmButtonText="Delete"
          isPositive={false}
          children={
            <div className="flex flex-col gap-4">
              <p>
                https://url-shortener-be-production-aa52.up.railway.app/
                <span className="font-bold">{focusHash}</span>?r=Facebook
              </p>
              <p>
                The selected shortened URL will be deleted forever and can no
                longer be accessed by any means!
              </p>
            </div>
          }
        />

        <ConfirmModal
          show={isEditModalOpen}
          loading={loading}
          close={onClickCloseEditModal}
          title="Customize alias"
          onConfirm={editAlias}
          onCancel={onClickCloseEditModal}
          confirmButtonText="Confirm"
          isPositive={true}
          children={
            <div className="flex flex-col gap-4">
              <p>
                https://url-shortener-be-production-aa52.up.railway.app/
                <span className="font-bold">{focusHash}</span>?r=Facebook
              </p>

              <form>
                <input
                  id="email"
                  name="email"
                  type="text"
                  onChange={onChangeUrl}
                  placeholder="Enter a new alias"
                  value={newHash}
                  className="w-full rounded border border-solid p-3 focus:border-primary"
                />
              </form>

              <p>This action can not be be reversed! </p>
            </div>
          }
        />

        {/* Shorten URL modal */}
        <ModalWrapper
          show={isShortenModalOpen}
          close={onClickCloseShortenModal}
        >
          {phase === ShortenPhase.SHORTEN && (
            <form
              onSubmit={urlFormik.handleSubmit}
              className="relative mb-16 mt-10 flex flex-col items-center gap-4 rounded-lg bg-white p-5 xl:mt-0 xl:items-start"
            >
              <div className="text-[24px] font-bold ">Shorten URL</div>
              <div className="relative flex w-80 flex-col gap-4 xs:w-[25rem] sm:w-[30rem] lg:w-[35rem] xl:w-[40rem] xl:gap-4 2xl:w-[42.5rem] 4xl:w-[50rem]">
                <label htmlFor="email" className="relative font-bold">
                  Your long URL
                </label>
                <div className="relative flex flex-col items-center justify-start gap-2 lg:items-start">
                  <input
                    id="longUrl"
                    name="longUrl"
                    type="text"
                    placeholder="Shorten your link"
                    onChange={urlFormik.handleChange}
                    onBlur={urlFormik.handleBlur}
                    value={urlFormik.values.longUrl}
                    className={`${urlFormik.touched.longUrl && urlFormik.errors.longUrl ? 'border-red' : 'border-black'} w-full truncate rounded border border-solid p-3 focus:border-primary`}
                  />
                  {urlFormik.touched.longUrl && urlFormik.errors.longUrl ? (
                    <div className="flex text-red">
                      {urlFormik.errors.longUrl}
                    </div>
                  ) : null}
                </div>
              </div>
              <div className="relative flex w-80 flex-col gap-4 xs:w-[25rem] sm:w-[30rem] lg:w-[35rem] xl:w-[40rem] xl:gap-4 2xl:w-[42.5rem] 4xl:w-[50rem]">
                <label htmlFor="email" className="relative font-bold">
                  Customize your link
                </label>
                <div className="relative flex flex-col items-center justify-start gap-2 lg:items-start">
                  <input
                    id="hash"
                    name="hash"
                    type="text"
                    placeholder="Shorten your link"
                    onChange={urlFormik.handleChange}
                    onBlur={urlFormik.handleBlur}
                    value={urlFormik.values.hash}
                    className={`${urlFormik.touched.hash && urlFormik.errors.hash ? 'border-red' : 'border-black'} w-full truncate rounded border border-solid p-3 focus:border-primary`}
                  />
                  {urlFormik.touched.hash && urlFormik.errors.hash ? (
                    <div className="flex text-red">{urlFormik.errors.hash}</div>
                  ) : null}
                </div>
              </div>

              {loading ? (
                <div className="flex flex-row justify-end">
                  <Skeleton className="mt-8 flex flex-row" width={100} />
                </div>
              ) : (
                <button
                  type="submit"
                  className="relative mt-4 flex size-fit items-center justify-center self-end rounded-lg bg-secondary px-12 py-2 font-bold text-white duration-200 ease-in-out hover:bg-secondary-700"
                >
                  Shorten
                </button>
              )}
            </form>
          )}
          {phase !== ShortenPhase.SHORTEN && (
            <div className="relative mb-16 flex flex-col items-center gap-4 rounded-lg bg-white p-5 xl:my-0 xl:items-start">
              <div className="text-[24px] font-bold xs:text-[32px] sm:text-[36px] lg:text-[44px] xl:text-[32px] 4xl:text-[40px]">
                URL SHORTENER PROJECT
              </div>
              <div className="relative flex w-80 flex-col gap-4 xs:w-[25rem] sm:w-[30rem] lg:w-[35rem] xl:w-[40rem] xl:gap-4 2xl:w-[42.5rem] 4xl:w-[50rem]">
                <label htmlFor="email" className="relative font-bold">
                  Your long URL
                </label>
                <div className="relative flex flex-col items-center justify-start gap-2 lg:items-start">
                  <div className="w-full truncate rounded border border-solid border-primary bg-white p-3">
                    {shortenedUrl?.longUrl}
                  </div>
                </div>
              </div>
              <div className="relative flex w-80 flex-col gap-4 xs:w-[25rem] sm:w-[30rem] lg:w-[35rem] xl:w-[40rem] xl:gap-4 2xl:w-[42.5rem] 4xl:w-[50rem]">
                <label htmlFor="shortenedUrl" className="relative font-bold">
                  Shortened URL
                </label>
                <div className="relative flex flex-col items-center justify-start gap-2 lg:items-start">
                  <div className="flex w-full flex-row justify-between rounded border border-solid border-primary bg-white p-3">
                    <div
                      id="shortenedUrl"
                      className="truncate"
                    >{`https://url-shortener-be-production-aa52.up.railway.app/${shortenedUrl?.hash}?r=Facebook`}</div>
                  </div>
                </div>
              </div>
              <div className="relative flex w-80 flex-row gap-4 xs:w-[25rem] sm:w-[30rem] lg:w-[35rem] xl:w-[40rem] xl:gap-2 2xl:w-[42.5rem] 4xl:w-[50rem]">
                <label htmlFor="email" className="relative font-bold">
                  Expiry date:
                </label>
                <div className="font-bold">
                  {toDateWithSlashes(
                    shortenedUrl?.expiresAt
                      ? new Date(shortenedUrl?.expiresAt)
                      : new Date(),
                  )}
                </div>
              </div>
              <div className="relative flex flex-row gap-4">
                <button
                  type="button"
                  onClick={() => copyUrl()}
                  className="relative mt-4 flex size-fit items-center justify-center gap-2 self-end rounded-lg bg-primary px-6 py-2 font-bold text-white duration-200 ease-in-out hover:bg-primary-700 xs:px-12"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="21"
                    height="21"
                    viewBox="0 0 23 21"
                    fill="none"
                    className="cursor-pointer"
                    onClick={() => copyUrl()}
                  >
                    <g clip-path="url(#clip0_120_741)">
                      <path
                        d="M4.7915 13.0491H3.83317C3.32484 13.0491 2.83733 12.8688 2.47788 12.5478C2.11844 12.2269 1.9165 11.7916 1.9165 11.3378V3.63688C1.9165 3.18301 2.11844 2.74773 2.47788 2.4268C2.83733 2.10587 3.32484 1.92557 3.83317 1.92557H12.4582C12.9665 1.92557 13.454 2.10587 13.8135 2.4268C14.1729 2.74773 14.3748 3.18301 14.3748 3.63688V4.49253M10.5415 7.91515H19.1665C20.225 7.91515 21.0832 8.68133 21.0832 9.62646V17.3274C21.0832 18.2725 20.225 19.0387 19.1665 19.0387H10.5415C9.48296 19.0387 8.62484 18.2725 8.62484 17.3274V9.62646C8.62484 8.68133 9.48296 7.91515 10.5415 7.91515Z"
                        stroke="#ffffff"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_120_741">
                        <rect
                          width="23"
                          height="20.5357"
                          fill="white"
                          transform="translate(0 0.214264)"
                        />
                      </clipPath>
                    </defs>
                  </svg>
                  Copy URL
                </button>
              </div>
            </div>
          )}
        </ModalWrapper>

        {/* QR URL modal */}
        <ModalWrapper show={isQrModalOpen} close={onClickCloseQrModal}>
          <div className="relative mb-16 mt-10 flex flex-col items-center gap-4 rounded-lg bg-white p-5 xl:mt-0 xl:items-start">
            <div className="relative flex flex-row gap-10">
              <div className="relative flex max-w-80 flex-col gap-5">
                <div className="text-[24px] font-bold">Generate QR Code</div>
                <div>{focusHash}</div>
              </div>
              <img
                alt="QR code"
                src={qrDataUrl || ''}
                className="relative aspect-square w-80 rounded-lg xs:w-[25rem] sm:w-[30rem] lg:w-[35rem] xl:w-80 2xl:w-72"
              />
            </div>
            <div className="flex w-full flex-row gap-5">
              <button
                onClick={onClickCloseQrModal}
                className="w-full rounded-lg border border-solid border-[#303030] px-4 py-2 text-[#303030] duration-200 ease-in-out hover:bg-[#303030] hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={downloadQr}
                className="w-full rounded-lg border border-solid border-primary bg-primary px-4 py-2 text-white duration-200 ease-in-out hover:bg-primary-700"
              >
                Save QR
              </button>
            </div>
          </div>
        </ModalWrapper>
        <img
          alt="Background"
          src="/images/background-admin.png"
          className="absolute h-full object-cover object-center lg:w-screen"
        />

        <CampaignStats
          chartData={chartData}
          totalClickCount={totalClickCount}
          totalShortenedLinks={totalShortenedLinks}
        />
        <UrlList
          campaignId={cpnid}
          onClickOpenQrModal={onClickOpenQrModal}
          urlsList={urlsList}
          page={page}
          totalPages={totalPages}
          setPage={setPage}
          loading={loading}
          onClickOpenShortenModal={onClickOpenShortenModal}
          onClickOpenModal={onClickOpenDeleteModal}
          onClickOpenEditModal={onClickOpenEditModal}
        />
      </div>
      <Footer />
    </>
  );
}
