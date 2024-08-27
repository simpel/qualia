import { Tables } from '@/types/supabase';

export const createName = (
  profile?: Partial<Tables<'profiles'>>,
  initials?: boolean,
) => {
  if (profile?.first_name === null && profile?.last_name === null)
    return undefined;

  if (initials)
    return `${profile?.first_name?.charAt(0)}${profile?.last_name?.charAt(0)}`;

  return `${profile?.first_name} ${profile?.last_name}`;
};
