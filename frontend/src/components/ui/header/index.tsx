import { Link, useNavigate } from '@tanstack/react-router';

import Logo from '@/components/icons/logo';
import useAuthStore from '@/store/use-auth-store';

import { Button } from '../button/button';
const Header = () => {
  const navigate = useNavigate();

  const { token, logout, user } = useAuthStore();

  const isAdmin = user?.roles.some((role) => role.name === 'ADMIN');
  const isManager = user?.roles.some((role) => role.name === 'MANAGER');

  return (
    <div className="relative left-0 top-0 z-50 flex h-16 w-full flex-row items-center justify-between bg-white px-5 text-neutral shadow-lg xs:px-[32px] sm:px-10 lg:px-[48px] xl:px-[80px] 2xl:px-[96px]  3xl:px-[calc(160px-(1920px-100vw)/3)]">
      <Link to="/">
        <Logo />
      </Link>
      {token ? (
        <div className="flex flex-row items-center space-x-6 md:space-x-10 lg:space-x-12">
          <Link to="/" className="hover:underline">
            Home
          </Link>
          <Link to="/my-urls" className="hover:underline">
            My URLs
          </Link>

          {(isManager || isAdmin) && (
            <Link to="/campaign" className="hover:underline">
              Campaign
            </Link>
          )}

          {isAdmin && (
            <Link to="/admin" className="hover:underline">
              Admin
            </Link>
          )}

          <div className="w-28">
            <Button
              onClick={() => {
                logout();
                navigate({ to: '/login' });
              }}
              theme="neutral"
              variant="outlined"
              width="full"
            >
              Sign Out
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-row items-center space-x-4">
          <div className="w-28">
            <Button
              onClick={() => {
                navigate({ to: '/register' });
              }}
              theme="neutral"
              variant="outlined"
              width="full"
            >
              Register
            </Button>
          </div>
          <div className="w-28">
            <Button
              onClick={() => {
                navigate({ to: '/login' });
              }}
              theme="primary"
              variant="contained"
              width="full"
            >
              Log In
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
