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

  const { data: currentClass } = await supabase
    .from('classes')
    .select(
      `
      *,
      classes_users (
        *,
        profiles (first_name, last_name, id, email, user_id, gravatar, last_loggedin_at)
      )
      `,
    )
    .eq('id', params.id)
    .single();

  if (currentClass === null) redirect('/classes');

  return <div className="container mx-auto">sd</div>;
}
