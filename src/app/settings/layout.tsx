import { redirect } from 'next/navigation';

import { getCurrentUserOptional } from '@/lib/auth/current-user';

export default async function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUserOptional();
  if (!user) {
    redirect('/login?next=/settings');
  }
  return <>{children}</>;
}
