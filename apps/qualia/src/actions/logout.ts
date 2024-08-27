'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '../utils/clients/server';

export const logout = async (redirectPath?: string) => {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  revalidatePath('/');

  redirect(redirectPath || '/');
};
