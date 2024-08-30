'use server';

import { IStatus } from '@/types/generic';
import { parseDictionary } from '@/utils/dictionary/dictionary';
import { isAuthenticated } from '@/utils/isAuthenticated/isAuthenticated';
import dictionary from '@qualia/dictionary';
import { revalidatePath } from 'next/cache';
import { createClient } from '../utils/clients/server';

export interface IRemoveStudentFromClass {
  status?: IStatus;
}

export const removeProfile = async (
  prevState: IRemoveStudentFromClass,
  formData: FormData,
): Promise<IRemoveStudentFromClass> => {
  const supabase = createClient();
  await isAuthenticated();

  const profileId = formData.get('profile_id') as string;
  const path = formData.get('path') as string;
  const name = formData.get('name') as string;

  console.log({ profileId, path, name });

  const { error, data } = await supabase
    .from('profiles')
    .delete()
    .eq('id', profileId)
    .select();

  console.log({ error, data });

  revalidatePath(path);

  if (error) {
    return {
      ...prevState,
      status: {
        message: parseDictionary(dictionary.remove_profile_error, {
          name: name,
        }),
        status: 'error',
      },
    };
  }

  return {
    ...prevState,
    status: {
      message: parseDictionary(dictionary.remove_profile_success, {
        name: name,
      }),
      status: 'success',
    },
  };
};
