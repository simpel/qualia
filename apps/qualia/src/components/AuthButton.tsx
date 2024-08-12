import { createClient } from '@/utils/clients/server';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function AuthButton() {
  const supabase = createClient();

  const auth = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from('profiles')
    .select()
    .eq('user_id', auth.data.user?.id)
    .single();

  console.log({ auth: auth.data.user?.id, profile: profile });

  const signOut = async () => {
    'use server';

    const supabase = createClient();
    await supabase.auth.signOut();
    return redirect('/login');
  };

  return profile ? (
    <div className="flex items-center gap-4">
      Hey {profile.first_name}
      <form action={signOut}>
        <button className="rounded-md bg-btn-background px-4 py-2 no-underline hover:bg-btn-background-hover">
          Logout
        </button>
      </form>
    </div>
  ) : (
    <Link
      href="/login"
      className="flex rounded-md bg-btn-background px-3 py-2 no-underline hover:bg-btn-background-hover"
    >
      Login
    </Link>
  );
}
