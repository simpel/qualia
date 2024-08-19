'use server';

import { IStatus } from '@/types/generic';
import dictionary from '@qualia/dictionary';
import { Message, sha256 } from 'js-sha256';
import { revalidatePath } from 'next/cache';
import { Tables } from '../types/supabase';
import { createClient } from '../utils/clients/server';
import { getUser } from '../utils/server/user';

export interface IAddStudentsToClass {
  classId: Tables<'classes'>['id'];
  emails?: string[];
  status?: IStatus;
}

export const addStudentsToClass = async (
  prevState: IAddStudentsToClass,
  formData: FormData,
): Promise<Error | IAddStudentsToClass> => {
  const supabase = createClient();
  const user = await getUser();

  if (!user) return new Error('User not found');

  const { error } = await supabase.from('profiles').upsert({
    email: formData.get('email'),
    gravatar: sha256(formData.get('email') as Message) as string,
  } as Tables<'profiles'>);

  revalidatePath('/classes');
  if (error) {
    return {
      ...prevState,
      status: {
        message: dictionary.class_add_students_error,
        status: 'error',
      },
    };
  }

  return {
    ...prevState,
    status: {
      message: dictionary.class_add_students_success,
      status: 'success',
    },
  };
};
