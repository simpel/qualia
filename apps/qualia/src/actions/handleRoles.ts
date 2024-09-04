'use server';

import { Tables } from '@/types/supabase';
import { isAuthenticated } from '@/utils/isAuthenticated/isAuthenticated';
import { PostgrestSingleResponse } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';
import { createClient } from '../utils/clients/server';

export interface IRolesStatus {
  id: number;
  isSelected: boolean;
}

export interface IHandleRoles {
  profileId: string;
  roles: IRolesStatus[];
  path?: string;
}

type TPromise = Promise<
  (PostgrestSingleResponse<Tables<'profiles_roles'>> | undefined)[]
>;

export const handleRoles = async ({
  profileId,
  roles,
  path,
}: IHandleRoles): Promise<TPromise> => {
  const supabase = createClient();
  await isAuthenticated();

  const promises = roles.map(async (role) => {
    const { data } = await supabase
      .from('profiles_roles')
      .select('id')
      .eq('profile_id', profileId)
      .eq('role_id', role.id)
      .single();

    if (role.isSelected) {
      if (!data) {
        return supabase
          .from('profiles_roles')
          .insert({
            profile_id: profileId,
            role_id: role.id,
          })
          .select('*')
          .single();
      }
    } else {
      if (data) {
        return supabase
          .from('profiles_roles')
          .delete()
          .eq('profile_id', profileId)
          .eq('role_id', role.id)
          .select('*')
          .single();
      }
    }
  });

  const response = Promise.all(promises).then((data) =>
    data.filter((item) => item),
  );

  path && revalidatePath(path, 'page');

  return response;
};
