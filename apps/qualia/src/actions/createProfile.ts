'use server';

import { Message, sha256 } from 'js-sha256';
import { redirect } from 'next/navigation';
import { Tables } from '../types/supabase';
import { createClient } from '../utils/clients/server';
import { getUser } from '../utils/server/user';

export const createProfile = async (
  next: string,
  source: string,
  formData: FormData,
) => {
  const supabase = createClient();
  const user = await getUser();

  if (!user) return new Error('User not found');

  const { error } = await supabase.from('profiles').upsert({
    user_id: user.id,
    email: formData.get('email'),
    last_name: formData.get('last_name'),
    first_name: formData.get('first_name'),
    gravatar: sha256(formData.get('email') as Message) as string,
  } as Tables<'profiles'>);

  return error ? redirect(`${source}?error=${error.message}`) : redirect(next);
};
