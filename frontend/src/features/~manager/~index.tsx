import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/manager/')({
  component: RouteComponent,
});

function RouteComponent() {
  return 'Hello /manager/!';
}
