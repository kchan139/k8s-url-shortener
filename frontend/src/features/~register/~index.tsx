import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import Footer from '@/components/ui/footer';
import Header from '@/components/ui/header';
import Section from '@/components/ui/section-wrapper';
import { passwordRegex } from '@/data/auth-data';
import AuthService from '@/services/auth.service';
import UserService from '@/services/user.service';
import useAuthStore from '@/store/use-auth-store';

export const Route = createFileRoute('/register/')({
  component: Register,
});

function Register() {
  const { changeToken, changeUser } = useAuthStore();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      tac: false,
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required('Please enter your first name'),
      lastName: Yup.string().required('Please enter your last name'),
      email: Yup.string()
        // .matches(
        //   emailRegex,
        //   'Email must be your HCMUT academic email (@hcmut.edu.vn).',
        // )
        .required('Please enter your email'),
      password: Yup.string()
        .matches(
          passwordRegex,
          'Password must be at least 8 characters, include at least one uppercase letter, one lowercase letter, one number, and one special character.',
        )
        .required('Please enter your password'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), ''], 'Password not match')
        .required('Please confirm your password'),
      tac: Yup.boolean().oneOf(
        [true],
        'You have to agree to the Terms & Conditions to register!',
      ),
    }),
    onSubmit: async () => {
      await UserService.registerUser(
        formik.values.email,
        formik.values.password,
        formik.values.firstName,
        formik.values.lastName,
      )
        .then(async () => {
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
        })
        .catch((error) => {
          console.error('Error:', error.response.data);
          toast.error('Register failed!');
        });
    },
  });

  return (
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
            Already have an account?{' '}
            <Link
              to="/login"
              className="cursor-pointer underline underline-offset-4"
            >
              Sign in
            </Link>
          </div>
          <div className="relative flex w-80 flex-col gap-2 xs:w-[25rem] sm:w-[30rem] lg:w-[35rem] xl:w-[40rem] 2xl:w-[45rem] 4xl:w-[50rem]">
            <div className="relative flex flex-col gap-2 lg:flex-row lg:gap-4">
              <div className="relative flex flex-col gap-2 lg:w-1/2">
                <label htmlFor="firstName" className="relative font-bold">
                  First Name:
                </label>
                <div className="relative flex flex-col items-center justify-start gap-2 lg:items-start">
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.firstName}
                    className={`${formik.touched.firstName && formik.errors.firstName ? 'border-red' : 'border-transparent'} w-full rounded border border-solid p-3 focus:border-primary`}
                  />
                  {formik.touched.firstName && formik.errors.firstName ? (
                    <div className="flex text-red">
                      {formik.errors.firstName}
                    </div>
                  ) : null}
                </div>
              </div>
              <div className="relative flex flex-col gap-2 lg:w-1/2">
                <label htmlFor="lastName" className="relative font-bold">
                  Last Name:
                </label>
                <div className="relative flex flex-col items-center justify-start gap-2 lg:items-start">
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.lastName}
                    className={`${formik.touched.lastName && formik.errors.lastName ? 'border-red' : 'border-transparent'} w-full rounded border border-solid p-3 focus:border-primary`}
                  />
                  {formik.touched.lastName && formik.errors.lastName ? (
                    <div className="flex text-red">
                      {formik.errors.lastName}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
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
          <div className="relative flex w-80 flex-col gap-2 xs:w-[25rem] sm:w-[30rem] lg:w-[35rem] xl:w-[40rem] 2xl:w-[45rem] 4xl:w-[50rem]">
            <label htmlFor="confirmPassword" className="relative font-bold">
              Confirm Password:
            </label>
            <div className="relative flex flex-col items-center justify-start gap-2 lg:items-start">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.confirmPassword}
                className={`${formik.touched.confirmPassword && formik.errors.confirmPassword ? 'border-red' : 'border-transparent'} w-full rounded border border-solid p-3 focus:border-primary`}
              />
              {formik.touched.confirmPassword &&
              formik.errors.confirmPassword ? (
                <div className="flex text-red">
                  {formik.errors.confirmPassword}
                </div>
              ) : null}
            </div>
          </div>
          <div className="relative flex w-80 flex-row items-start gap-3 xs:w-[25rem] sm:w-[30rem] lg:w-[35rem] xl:w-[40rem] 2xl:w-[45rem] 4xl:w-[50rem]">
            <input
              id="tac"
              name="tac"
              type="checkbox"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`${formik.touched.tac && formik.errors.tac ? 'border-red' : 'border-primary'} aspect-square w-4 rounded border border-solid p-3 accent-black focus:border-primary`}
            />
            <div className="relative flex flex-col items-start justify-start gap-2 lg:items-start">
              <div className="font-bold">Terms & Conditions</div>
              <div>
                I agree to the{' '}
                <span className="cursor-pointer underline underline-offset-4">
                  terms and condition
                </span>
              </div>
              {formik.touched.tac && formik.errors.tac ? (
                <div className="flex text-red">{formik.errors.tac}</div>
              ) : null}
            </div>
          </div>
          <button
            type="submit"
            className="relative flex size-fit items-center justify-center rounded-lg bg-primary px-12 py-2 font-bold text-white duration-200 ease-in-out hover:bg-primary-700"
          >
            Register
          </button>
        </form>
      </Section>
      <Footer />
    </div>
  );
}
