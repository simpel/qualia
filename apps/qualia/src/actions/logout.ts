'use server';

import { redirect } from 'next/navigation';
import { createClient } from '../utils/clients/server';

export const logout = async (
  next: string,

  formData: FormData,
) => {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();

  console.log('logout', error);

  return error ? redirect(`}?error=${error.message}`) : redirect(next);
};
