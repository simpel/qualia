'use server';

import { IStatus } from '@/types/generic';
import dictionary from '@qualia/dictionary';
import { revalidatePath } from 'next/cache';
import { createClient } from '../utils/clients/server';

export const sendMagicLink = async (
  prevState: IStatus,
  formData: FormData,
): Promise<IStatus> => {
  const email = formData.get('email') as string;
  const path = formData.get('path') as string;
  const supabase = createClient();

  try {
    await supabase.auth.signInWithOtp({
      email,
    });
    revalidatePath(path);
    return {
      ...prevState,
      status: 'success',
      message: dictionary.sent_magic_link,
    };
  } catch (error) {
    revalidatePath(path);
    return {
      ...prevState,
      status: 'error',
      message: dictionary.sent_magic_link_failed,
    };
  }
};
