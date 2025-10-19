import { createFileRoute, Link } from '@tanstack/react-router';

import Footer from '@/components/ui/footer';
import Header from '@/components/ui/header';
import Section from '@/components/ui/section-wrapper';

export const Route = createFileRoute('/admin/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="relative flex w-full flex-col">
      <Header />
      <Section>
        <div className="flex space-x-4">
          <Link
            to="/admin/permission"
            className="rounded border border-primary px-4 py-2 text-primary-700 transition duration-200 hover:bg-primary hover:text-white"
          >
            Permission
          </Link>
          <Link
            to="/admin/role"
            className="rounded border border-primary px-4 py-2 text-primary-700 transition duration-200 hover:bg-primary hover:text-white"
          >
            Role
          </Link>
          <Link
            to="/admin/user"
            className="rounded border border-primary px-4 py-2 text-primary-700 transition duration-200 hover:bg-primary hover:text-white"
          >
            User
          </Link>
        </div>
      </Section>
      <Footer />
    </div>
  );
}
