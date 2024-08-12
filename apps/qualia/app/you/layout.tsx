import { Header } from '@/components/Header/Header';
import { getProfile } from '@/utils/server/profile';
import { redirect } from 'next/navigation';

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, profile } = await getProfile();

  if (!user.data) redirect('/login');
  if (!profile?.data) redirect('/hello');

  return (
    <>
      <Header profile={profile.data} />
      <main className="flex min-h-screen flex-col items-center">
        {children}
      </main>
    </>
  );
}
