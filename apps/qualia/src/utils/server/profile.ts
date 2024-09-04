import { PostgrestSingleResponse, UserResponse } from '@supabase/supabase-js';
import { Tables } from '../../types/supabase';
import { createClient } from '../clients/server';

interface IError {
  message: string;
  status: 'no_profile' | 'no_user';
}
type TRoles = {
  role: {
    id: number;
    name: string;
  } | null;
}[];

export interface IGetProfile {
  user: UserResponse;
  profile: PostgrestSingleResponse<Tables<'profiles'>> | null;
  roles?: Tables<'roles'>[];
}

export const getProfile = async (): Promise<IGetProfile> => {
  const supabase = createClient();

  const user = await supabase.auth.getUser();

  if (user.data.user?.id) {
    const profile = await supabase
      .from('profiles')
      .select(
        `*, 
        roles:profiles_roles (
          role:roles (
            *
          )
        )
        `,
      )
      .eq('user_id', user.data.user.id)
      .single();

    return {
      user: user,
      profile: profile,
      roles: profile.data?.roles.map((role) => role.role) as Tables<'roles'>[],
    };
  }

  return {
    user,
    profile: null,
    roles: undefined,
  };
};
