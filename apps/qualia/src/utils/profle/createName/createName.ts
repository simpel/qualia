import { Tables } from '@/types/supabase';

export const createName = (profile?: Partial<Tables<'profiles'>>) => {
  if (profile?.first_name === null && profile?.last_name === null)
    return undefined;
  return `${profile?.first_name} ${profile?.last_name}`;
};
