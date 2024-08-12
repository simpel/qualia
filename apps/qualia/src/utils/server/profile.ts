import { PostgrestSingleResponse, UserResponse } from '@supabase/supabase-js';
import { Tables } from '../../types/supabase';
import { createClient } from '../clients/server';

interface IError {
  message: string;
  status: 'no_profile' | 'no_user';
}

export interface IGetProfile {
  user: UserResponse;
  profile: PostgrestSingleResponse<Tables<'profiles'>> | null;
}

export const getProfile = async (): Promise<IGetProfile> => {
  const supabase = createClient();

  const user = await supabase.auth.getUser();

  if (user.data.user?.id) {
    const profile = await supabase
      .from('profiles')
      .select()
      .eq('user_id', user.data.user.id)
      .single();

    return {
      user: user,
      profile: profile,
    };
  }

  return {
    user,
    profile: null,
  };
};
