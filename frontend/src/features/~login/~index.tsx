import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import Footer from '@/components/ui/footer';
import Header from '@/components/ui/header';
import Section from '@/components/ui/section-wrapper';
import {
  emailRegex,
  // passwordRegex
} from '@/data/auth-data';
import AuthService from '@/services/auth.service';
import useAuthStore from '@/store/use-auth-store';

export const Route = createFileRoute('/login/')({
  component: Login,
});

function Login() {
  const { changeToken, changeUser } = useAuthStore();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .matches(
          emailRegex,
          'Email must be your HCMUT academic email (@hcmut.edu.vn).',
        )
        .required('Please enter your email'),
      password: Yup.string()
        // .matches(
        //   passwordRegex,
        //   'Password must be at least 8 characters, include at least one uppercase letter, one lowercase letter, one number, and one special character.',
        // )
        .required('Please enter your password'),
      rememberMe: Yup.boolean(),
    }),
    onSubmit: async () => {
      await AuthService.loginByEmail(
        formik.values.email,
        formik.values.password,
      )
        .then(async (response) => {
          changeToken(response.data.token);
          const user = await AuthService.getMe();
          changeUser(user.data);
          navigate({ to: '/' });
          toast.success('Login successful!');
        })
        .catch((error) => {
          console.error('Error:', error.response.data);
        });
    },
  });

  return (
    <>
      <div className="relative flex w-full flex-col">
        <Header />
        <img
          alt="Background"
          src="/images/background-auth.png"
          className="absolute h-screen object-cover object-center lg:w-screen"
        />
        <Section>
          <form
            onSubmit={formik.handleSubmit}
            className="relative mb-16 mt-8 flex flex-col items-center gap-4 xl:items-start"
          >
            <div>
              Don't have an account?{' '}
              <Link
                to="/register"
                className="cursor-pointer underline underline-offset-4"
              >
                Register
              </Link>
            </div>
            <div className="relative flex w-80 flex-col gap-2 xs:w-[25rem] sm:w-[30rem] lg:w-[35rem] xl:w-[40rem] 2xl:w-[45rem] 4xl:w-[50rem]">
              <label htmlFor="email" className="relative font-bold">
                E-mail:
              </label>
              <div className="relative flex flex-col items-center justify-start gap-2 lg:items-start">
                <input
                  id="email"
                  name="email"
                  type="text"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                  className={`${formik.touched.email && formik.errors.email ? 'border-red' : 'border-transparent'} w-full rounded border border-solid p-3 focus:border-primary`}
                />
                {formik.touched.email && formik.errors.email ? (
                  <div className="flex text-red">{formik.errors.email}</div>
                ) : null}
              </div>
            </div>
            <div className="relative flex w-80 flex-col gap-2 xs:w-[25rem] sm:w-[30rem] lg:w-[35rem] xl:w-[40rem] 2xl:w-[45rem] 4xl:w-[50rem]">
              <label htmlFor="password" className="relative font-bold">
                Password:
              </label>
              <div className="relative flex flex-col items-center justify-start gap-2 lg:items-start">
                <input
                  id="password"
                  name="password"
                  type="password"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                  className={`${formik.touched.password && formik.errors.password ? 'border-red' : 'border-transparent'} w-full rounded border border-solid p-3 focus:border-primary`}
                />
                {formik.touched.password && formik.errors.password ? (
                  <div className="flex text-red">{formik.errors.password}</div>
                ) : null}
              </div>
            </div>

            <div className="relative mt-4 flex w-80 flex-row items-center gap-3 xs:w-[25rem] sm:w-[30rem] lg:w-[35rem] xl:w-[40rem] 2xl:w-[45rem] 4xl:w-[50rem]">
              <input
                id="rememberMe"
                name="rememberMe"
                type="checkbox"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`${formik.touched.rememberMe && formik.errors.rememberMe ? 'border-red' : 'border-primary'} aspect-square w-4 rounded border border-solid p-3 accent-black focus:border-primary`}
              />
              <div className="flex items-center justify-center">
                Remember me
              </div>
            </div>
            <button
              type="submit"
              className="relative mt-2 flex size-fit items-center justify-center rounded-lg bg-primary px-12 py-2 font-bold text-white duration-200 ease-in-out hover:bg-primary-700"
            >
              Login
            </button>
          </form>
        </Section>
        <Footer />
      </div>
    </>
  );
}
