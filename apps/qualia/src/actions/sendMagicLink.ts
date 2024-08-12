import dictionary from '@qualia/dictionary';
import { redirect } from 'next/navigation';
import { createClient } from '../utils/clients/server';

export const sendMagicLink = async (
  next: string,
  source: string,
  formData: FormData,
) => {
  'use server';

  const email = formData.get('email') as string;
  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${process.env.SITE_URL}/you`,
    },
  });

  if (error) {
    return redirect(
      `${source}?message=${dictionary['authentication_failed']}&status=400`,
    );
  } else {
    return redirect(
      `${source}?message=${dictionary['sent_magic_link']}&status=200`,
    );
  }
};
