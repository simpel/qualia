import { createClient } from '@/utils/clients/server';

import { getProfile } from '@/utils/server/profile';
import { redirect } from 'next/navigation';

interface IClassesPage {
  params: {
    id: number;
  };
  searchParams: Record<string, string>;
}

export default async function ClassesPage({ params }: IClassesPage) {
  if (params.id === null) redirect('/classes');

  const { profile, user, roles } = await getProfile();

  const supabase = createClient();

  const { data: currentProfile } = await supabase
    .from('profiles')
    .select(
      `
      *
      `,
    )
    .eq('id', params.id)
    .single();

  if (currentProfile === null) redirect('/users');

  return <div className="container mx-auto">{currentProfile.first_name}</div>;
}
