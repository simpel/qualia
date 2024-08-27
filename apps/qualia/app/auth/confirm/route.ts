import { type EmailOtpType } from '@supabase/supabase-js';
import { redirect } from 'next/navigation';
import { type NextRequest } from 'next/server';
import { createClient } from '../../../src/utils/clients/server';
import { getProfile } from '../../../src/utils/server/profile';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type') as EmailOtpType | null;
  const next = searchParams.get('next') ?? '/';

  if (token_hash && type) {
    const supabase = createClient();

    const { error, data } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });

    if (data.user?.id) {
      // redirect user to specified redirect URL or root of app

      const profile = await getProfile();

      //add latest login time

      console.log('on confirm', profile);
      if (profile.profile?.data?.id !== undefined) {
        await supabase
          .from('profiles')
          .update({
            last_loggedin_at: new Date().toISOString(),
          })
          .eq('id', profile.profile.data.id);
      }

      if (profile) {
        redirect(next);
      } else {
        redirect('/hello');
      }
    }

    console.error('Could not verify OTP', { error });
  }
  // redirect the user to an error page with some instructions
  redirect('/error');
}
