import { Link } from '@tanstack/react-router';
import { useFormik } from 'formik';
import { useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import Section from '@/components/ui/section-wrapper';
// import { emailRegex, passwordRegex } from '@/data/auth-data';
import { urlRegex } from '@/data/url-data';
import { handleAxiosError } from '@/helpers/handle-axios-error';
import UrlsService from '@/services/urls.service';
import { ShortenedUrl } from '@/types/url';
// import AuthService from '@/services/auth.service';
// import useAuthStore from '@/store/use-auth-store';

enum ShortenPhase {
  SHORTEN = 'SHORTEN',
  RESULT = 'RESULT',
}

const ShortenGuest = () => {
  // const { changeToken, changeUser } = useAuthStore();
  const [shortenedUrl, setShortenedUrl] = useState<
    Omit<ShortenedUrl, 'deleted'>
  >({
    longUrl: '',
    hash: '',
    clickCount: 0,
    createdAt: '',
    expiresAt: '',
  });
  const [loading, setLoading] = useState(false);

  const shortenUrl = async (longUrl: string) => {
    try {
      setLoading(true);
      const { data } = await UrlsService.createUrlGuest(longUrl);
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

  const [phase, setPhase] = useState<ShortenPhase>(ShortenPhase.SHORTEN);
  const urlFormik = useFormik({
    initialValues: {
      longUrl: '',
    },
    validationSchema: Yup.object({
      longUrl: Yup.string()
        .matches(urlRegex, 'The input must be a valid URL')
        .required('Please enter the long URL'),
    }),
    onSubmit: async (value) => {
      await shortenUrl(value.longUrl);
    },
  });

  // const formik = useFormik({
  //   initialValues: {
  //     email: '',
  //     password: '',
  //     rememberMe: false,
  //   },
  //   validationSchema: Yup.object({
  //     email: Yup.string().required('Please enter your email'),
  //     password: Yup.string().required('Please enter your password'),
  //     rememberMe: Yup.boolean(),
  //   }),
  //   onSubmit: async () => {
  //     await AuthService.loginByEmail(
  //       formik.values.email,
  //       formik.values.password,
  //     )
  //       .then(async (response) => {
  //         changeToken(response.data.token);
  //         toast.success('Login successful!');
  //         const user = await AuthService.getMe();
  //         changeUser(user.data);
  //       })
  //       .catch((error) => {
  //         console.error('Error:', error.response.data);
  //       });
  //   },
  // });

  const copyUrl = () => {
    const urlElement = document.getElementById(
      'shortenedUrl',
    ) as HTMLDivElement | null;
    if (!urlElement) return;

    const url = urlElement.innerHTML;

    navigator.clipboard.writeText(url);

    toast.success('URL has been copied to clipboard!');
  };

  return (
    <>
      <img
        alt="Background"
        src="/images/background-auth.png"
        className="absolute h-full object-cover object-center lg:w-screen"
      />
      <Section className="flex min-h-[80vh] flex-col items-center xl:flex-row xl:justify-between">
        {phase === ShortenPhase.SHORTEN && (
          <form
            onSubmit={urlFormik.handleSubmit}
            className="relative mb-16 mt-10 flex flex-col items-center gap-8 xl:mt-0 xl:items-start"
          >
            <div className="text-[24px] font-bold xs:text-[32px] sm:text-[36px] lg:text-[44px] xl:text-[32px] 4xl:text-[40px]">
              URL SHORTENER PROJECT
            </div>
            <div className="relative flex w-80 flex-col gap-4 xs:w-[25rem] sm:w-[30rem] lg:w-[35rem] xl:w-[40rem] xl:gap-8 2xl:w-[42.5rem] 4xl:w-[50rem]">
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
                  className={`${urlFormik.touched.longUrl && urlFormik.errors.longUrl ? 'border-red' : 'border-transparent'} w-full rounded border border-solid p-3 focus:border-primary`}
                />
                {urlFormik.touched.longUrl && urlFormik.errors.longUrl ? (
                  <div className="flex text-red">
                    {urlFormik.errors.longUrl}
                  </div>
                ) : null}
              </div>
            </div>

            <Link
              disabled={loading}
              to="/login"
              className="font-bold underline"
            >
              Login to customize alias
            </Link>

            {loading ? (
              <div className="flex flex-row justify-end">
                <Skeleton className="mt-8 flex flex-row" width={100} />
              </div>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className={`${loading ? 'opacity-50' : ' hover:bg-primary-700'} relative mt-4 flex size-fit items-center justify-center rounded-lg bg-primary  px-12 py-2 font-bold text-white duration-200 ease-in-out `}
              >
                Shorten
              </button>
            )}
          </form>
        )}
        {phase === ShortenPhase.RESULT && (
          <div className="relative mb-16  flex flex-col items-center gap-8 xl:mt-[7.5rem] xl:items-start">
            <div className="text-[24px] font-bold xs:text-[32px] sm:text-[36px] lg:text-[44px] xl:text-[32px] 4xl:text-[40px]">
              URL SHORTENER PROJECT
            </div>
            <div className="relative flex w-80 flex-col gap-4 xs:w-[25rem] sm:w-[30rem] lg:w-[35rem] xl:w-[40rem] xl:gap-8 2xl:w-[42.5rem] 4xl:w-[50rem]">
              <label htmlFor="email" className="relative font-bold">
                Your long URL
              </label>
              <div className="relative flex flex-col items-center justify-start gap-2 lg:items-start">
                <div className="w-full rounded border border-solid border-primary bg-white p-3">
                  {shortenedUrl.longUrl}
                </div>
              </div>
            </div>
            <div className="relative flex w-80 flex-col gap-4 xs:w-[25rem] sm:w-[30rem] lg:w-[35rem] xl:w-[40rem] xl:gap-8 2xl:w-[42.5rem] 4xl:w-[50rem]">
              <label htmlFor="shortenedUrl" className="relative font-bold">
                Shortened URL
              </label>
              <div className="relative flex flex-col items-center justify-start gap-2 lg:items-start">
                <div className="flex w-full flex-row justify-between rounded border border-solid border-primary bg-white p-3">
                  <div id="shortenedUrl">{`https://url-shortener-be-production-aa52.up.railway.app/${shortenedUrl?.hash}?r=Facebook`}</div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="23"
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
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setPhase(ShortenPhase.SHORTEN);
                urlFormik.resetForm();
              }}
              className="relative mt-4 flex size-fit items-center justify-center rounded-lg bg-primary px-12 py-2 font-bold text-white duration-200 ease-in-out hover:bg-primary-700"
            >
              Shorten more
            </button>
          </div>
        )}
        {/* <form
          onSubmit={formik.handleSubmit}
          className="relative flex h-fit w-80 flex-col gap-6 rounded bg-white p-6 xs:w-[25rem] sm:w-[30rem] lg:w-[35rem] xl:w-80"
        >
          <div className="relative flex w-full flex-col gap-2">
            <label htmlFor="email" className="relative font-bold">
              E-mail:
            </label>
            <div className="relative flex flex-col items-start justify-start gap-2">
              <input
                id="email"
                name="email"
                type="text"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
                className={`${formik.touched.email && formik.errors.email ? 'border-red' : 'border-[#D9D9D9]'} w-full rounded border border-solid border-[#D9D9D9] p-3 focus:border-primary`}
              />
              {formik.touched.email && formik.errors.email ? (
                <div className="flex text-red">{formik.errors.email}</div>
              ) : null}
            </div>
          </div>
          <div className="relative flex w-full flex-col gap-2">
            <label htmlFor="password" className="relative font-bold">
              Password:
            </label>
            <div className="relative flex flex-col items-start justify-start gap-2">
              <input
                id="password"
                name="password"
                type="password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
                className={`${formik.touched.password && formik.errors.password ? 'border-red' : 'border-[#D9D9D9]'} w-full rounded border border-solid border-[#D9D9D9] p-3 focus:border-primary`}
              />
              {formik.touched.password && formik.errors.password ? (
                <div className="flex text-red">{formik.errors.password}</div>
              ) : null}
            </div>
          </div>
          <button
            type="submit"
            className="relative flex h-fit w-full items-center justify-center rounded-lg bg-primary px-12 py-2 font-bold text-white duration-200 ease-in-out hover:bg-primary-700"
          >
            Sign in
          </button>
          <Link to="/" className="cursor-pointer underline underline-offset-4">
            Forget your password
          </Link>
        </form> */}
      </Section>
    </>
  );
};

export default ShortenGuest;
