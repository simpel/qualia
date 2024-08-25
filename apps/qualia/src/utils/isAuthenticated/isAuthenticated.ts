import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '../clients/server';
import { getUser } from '../server/user';

export const isAuthenticated = async () => {
  const supabase = createClient();
  const user = await getUser();

  if (!user) {
    supabase.auth.signOut();
    revalidatePath('/');
    redirect('/');
  }
};
