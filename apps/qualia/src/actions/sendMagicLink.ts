'use server';

import dictionary from '@qualia/dictionary';
import { revalidatePath } from 'next/cache';
import { createClient } from '../utils/clients/server';

export interface IMagicLink {
  message?: string;
  status?: 'error' | 'success';
}

export const sendMagicLink = async (
  prevState: IMagicLink,
  formData: FormData,
) => {
  const email = formData.get('email') as string;
  const path = formData.get('path') as string;
  const supabase = createClient();

  try {
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
    });
    revalidatePath(path);
    return {
      status: 'success',
      message: dictionary.sent_magic_link,
      buttonStatus: 'successed',
    };
  } catch (error) {
    return {
      status: 'error',
      buttonStatus: 'ready',
      message: dictionary.sent_magic_link_failed,
    };
  }
};
