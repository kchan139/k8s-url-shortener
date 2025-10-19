import { useFormik } from 'formik';
import * as QRCode from 'qrcode';
import { useMemo, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import Section from '@/components/ui/section-wrapper';
import { urlRegex } from '@/data/url-data';
import { handleAxiosError } from '@/helpers/handle-axios-error';
import UrlsService from '@/services/urls.service';
import { ShortenedUrl } from '@/types/url';

enum ShortenPhase {
  SHORTEN = 'SHORTEN',
  RESULT = 'RESULT',
  QR = 'QR',
}

const ShortenAdmin = ({ userId }: { userId: string }) => {
  const [phase, setPhase] = useState<ShortenPhase>(ShortenPhase.SHORTEN);
  const [loading, setLoading] = useState(false);
  const [shortenedUrl, setShortenedUrl] = useState<
    (ShortenedUrl & 'userId') | null
  >(null);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);

  const expiresAtString = useMemo(() => {
    if (!shortenedUrl) return '';

    const expiresAtObject = new Date(shortenedUrl.expiresAt);

    const date = ('0' + expiresAtObject.getDate()).slice(-2);
    const month = ('0' + expiresAtObject.getMonth() + 1).slice(-2);
    const year = expiresAtObject.getFullYear();

    return date + '/' + month + '/' + year;
  }, [shortenedUrl]);

  const shortenUrl = async (longUrl: string, alias?: string) => {
    try {
      setLoading(true);
      const { data } = await UrlsService.createUrlUser(userId, longUrl, alias);
      setShortenedUrl(data);
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

  const copyUrl = () => {
    const urlElement = document.getElementById(
      'shortenedUrl',
    ) as HTMLDivElement | null;
    if (!urlElement) return;

    const url = urlElement.innerHTML;

    navigator.clipboard.writeText(url);

    toast.success('URL has been copied to clipboard!');
  };

  const generateQrDataUrl = () => {
    const urlElement = document.getElementById(
      'shortenedUrl',
    ) as HTMLDivElement | null;
    if (!urlElement) return;

    const url = urlElement.innerHTML;

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
        setPhase(ShortenPhase.QR);
      },
    );
  };

  const downloadQr = () => {
    if (!qrDataUrl || !shortenedUrl) {
      toast.error('There is no QR to download!');
      return;
    }

    const link = document.createElement('a');
    link.download = `bklink-${shortenedUrl.hash}.png`;
    link.href = qrDataUrl;
    link.click();
    document.removeChild(link);
  };

  return (
    <>
      <img
        alt="Background"
        src="/images/background-admin.png"
        className="absolute h-full object-cover object-center lg:w-screen"
      />
      <Section className="flex min-h-[80vh] flex-col items-center xl:flex-row xl:justify-between">
        {phase === ShortenPhase.SHORTEN && (
          <form
            onSubmit={urlFormik.handleSubmit}
            className="relative mb-16 mt-10 flex flex-col items-center gap-4 xl:mt-0 xl:items-start"
          >
            <div className="text-[24px] font-bold xs:text-[32px] sm:text-[36px] lg:text-[44px] xl:text-[32px] 4xl:text-[40px]">
              URL SHORTENER PROJECT
            </div>
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
                  className={`${urlFormik.touched.longUrl && urlFormik.errors.longUrl ? 'border-red' : 'border-transparent'} w-full truncate rounded border border-solid p-3 focus:border-primary`}
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
                  className={`${urlFormik.touched.hash && urlFormik.errors.hash ? 'border-red' : 'border-transparent'} w-full truncate rounded border border-solid p-3 focus:border-primary`}
                />
                {urlFormik.touched.hash && urlFormik.errors.hash ? (
                  <div className="flex text-red">{urlFormik.errors.hash}</div>
                ) : null}
              </div>
            </div>
            {/* <div className="relative flex w-80 flex-col gap-4 xs:w-[25rem] sm:w-[30rem] lg:w-[35rem] xl:w-[40rem] xl:gap-4 2xl:w-[42.5rem] 4xl:w-[50rem]">
              <label htmlFor="email" className="relative font-bold">
                Set expiry date
              </label>
              <div className="relative flex flex-col gap-2 lg:items-start">
                <input
                  id="expiresAt"
                  name="expiresAt"
                  type="date"
                  placeholder="Shorten your link"
                  onChange={urlFormik.handleChange}
                  onBlur={urlFormik.handleBlur}
                  value={urlFormik.values.expiresAt.toString()}
                  className={`${urlFormik.touched.expiresAt && urlFormik.errors.expiresAt ? 'border-red' : 'border-transparent'} w-fit rounded border border-solid p-3 focus:border-primary`}
                />
                {urlFormik.touched.expiresAt && urlFormik.errors.expiresAt ? (
                  <div className="flex text-red">
                    {urlFormik.errors.longUrl}
                  </div>
                ) : null}
              </div>
            </div> */}
            {loading ? (
              <div className="flex flex-row justify-end">
                <Skeleton className="mt-8 flex flex-row" width={100} />
              </div>
            ) : (
              <button
                type="submit"
                className="relative mt-4 flex size-fit items-center justify-center rounded-lg bg-secondary px-12 py-2 font-bold text-white duration-200 ease-in-out hover:bg-secondary-700"
              >
                Shorten
              </button>
            )}
          </form>
        )}
        {phase !== ShortenPhase.SHORTEN && (
          <div className="relative mb-16  flex flex-col items-center gap-4 xl:my-0 xl:items-start">
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
              <label htmlFor="email" className="relative font-bold">
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
              <div className="font-bold">{expiresAtString}</div>
            </div>
            <div className="relative flex flex-row gap-4">
              <button
                type="button"
                onClick={() => generateQrDataUrl()}
                className="relative mt-4 flex size-fit items-center justify-center rounded-lg bg-secondary px-6 py-2 font-bold text-white duration-200 ease-in-out hover:bg-secondary-700 xs:px-12"
              >
                Create QR
              </button>
              <button
                type="button"
                onClick={() => copyUrl()}
                className="relative mt-4 flex size-fit items-center justify-center gap-2 rounded-lg bg-white px-6 py-2 font-bold duration-200 ease-in-out hover:bg-slate-300 xs:px-12"
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
                      stroke="#1E1E1E"
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

        <div
          className={`${phase === ShortenPhase.QR ? 'flex' : 'hidden'} relative aspect-square w-80 flex-col items-center justify-between gap-6 rounded bg-[#FFFFFFB3] p-6 xs:w-[25rem] sm:w-[30rem] lg:w-[35rem] xl:w-80 2xl:w-[25rem]`}
        >
          <img
            alt="QR code"
            src={qrDataUrl || ''}
            className="relative aspect-square w-80 rounded-lg xs:w-[25rem] sm:w-[30rem] lg:w-[35rem] xl:w-80 2xl:w-72"
          />
          <div className="relative flex flex-row gap-4">
            <button
              type="button"
              onClick={() => downloadQr()}
              className="relative mt-4 flex size-fit flex-row items-center justify-center gap-2 rounded-lg border border-solid border-black bg-transparent px-4 py-2 duration-200 ease-in-out hover:bg-slate-400"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="17"
                height="16"
                viewBox="0 0 17 16"
                fill="none"
              >
                <path
                  d="M11.6336 14V8.66667H4.96696V14M4.96696 2V5.33333H10.3003M12.967 14H3.63363C3.28 14 2.94087 13.8595 2.69082 13.6095C2.44077 13.3594 2.30029 13.0203 2.30029 12.6667V3.33333C2.30029 2.97971 2.44077 2.64057 2.69082 2.39052C2.94087 2.14048 3.28 2 3.63363 2H10.967L14.3003 5.33333V12.6667C14.3003 13.0203 14.1598 13.3594 13.9098 13.6095C13.6597 13.8595 13.3206 14 12.967 14Z"
                  stroke="#1E1E1E"
                  stroke-width="1.6"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              Save
            </button>
            <button
              type="button"
              onClick={() => copyUrl()}
              className="relative mt-4 flex size-fit items-center justify-center gap-2 rounded-lg bg-secondary px-4 py-2 text-white duration-200 ease-in-out hover:bg-secondary-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="17"
                height="16"
                viewBox="0 0 17 16"
                fill="none"
              >
                <path
                  d="M3.3667 8.00004V13.3334C3.3667 13.687 3.50717 14.0261 3.75722 14.2762C4.00727 14.5262 4.34641 14.6667 4.70003 14.6667H12.7C13.0537 14.6667 13.3928 14.5262 13.6428 14.2762C13.8929 14.0261 14.0334 13.687 14.0334 13.3334V8.00004M11.3667 4.00004L8.70003 1.33337M8.70003 1.33337L6.03337 4.00004M8.70003 1.33337L8.70003 10"
                  stroke="#F5F5F5"
                  stroke-width="1.6"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              Share
            </button>
          </div>
        </div>
      </Section>
    </>
  );
};

export default ShortenAdmin;
