'use server';

import { IStatus } from '@/types/generic';
import dictionary from '@qualia/dictionary';
import { Message, sha256 } from 'js-sha256';
import { revalidatePath } from 'next/cache';
import { Tables } from '../types/supabase';
import { createClient } from '../utils/clients/server';
import { getUser } from '../utils/server/user';

export const createProfile = async (
  prevState: IStatus,
  formData: FormData,
): Promise<IStatus> => {
  const supabase = createClient();
  const user = await getUser();

  if (!user)
    return {
      message: dictionary.user_not_found,
      status: 'error',
    };

  const { error } = await supabase.from('profiles').upsert({
    user_id: user.id,
    email: formData.get('email'),
    last_name: formData.get('last_name'),
    first_name: formData.get('first_name'),
    gravatar: sha256(formData.get('email') as Message) as string,
  } as Tables<'profiles'>);

  revalidatePath('/');
  if (error) {
    return {
      message: dictionary.create_profile_error,
      status: 'error',
    };
  }

  return {
    message: dictionary.profile_created,
    status: 'success',
  };
};
