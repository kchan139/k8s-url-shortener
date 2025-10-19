import { createFileRoute } from '@tanstack/react-router';

import Footer from '@/components/ui/footer';
import Header from '@/components/ui/header';
import useAuthStore from '@/store/use-auth-store';

import ShortenAdmin from './components/shorten-admin';
import ShortenGuest from './components/shorten-guest';
import ShortenUser from './components/shorten-user';

export const Route = createFileRoute('/')({
  component: LandingPage,
});

function LandingPage() {
  const { token, user } = useAuthStore();

  return (
    <>
      <div className="relative flex flex-col">
        <Header />
        {!token && <ShortenGuest />}
        {token &&
          user &&
          !user?.roles.some((role) => role.name === 'ADMIN') && (
            <ShortenUser userId={user.id} />
          )}
        {token && user && user?.roles.some((role) => role.name === 'ADMIN') && (
          <ShortenAdmin userId={user.id} />
        )}
      </div>
      <Footer />
    </>
  );
}
