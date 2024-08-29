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

export const removeProfileFromClass = async (
  prevState: IRemoveStudentFromClass,
  formData: FormData,
): Promise<IRemoveStudentFromClass> => {
  const supabase = createClient();
  await isAuthenticated();

  const profileId = formData.get('profile_id') as string;
  const classId = formData.get('class_id') as string;
  const className = formData.get('class_name') as string;
  const studentName = formData.get('student_name') as string;

  console.log({ prevState, studentName, classId, profileId, className });

  const { error, data } = await supabase
    .from('classes_users')
    .delete()
    .eq('class_id', classId)
    .eq('profile_id', profileId)
    .select();

  revalidatePath(`/classes/[id]`, 'page');

  if (error) {
    return {
      ...prevState,
      status: {
        message: parseDictionary(dictionary.class_remove_student_error, {
          class: className,
          name: studentName,
        }),
        status: 'error',
      },
    };
  }

  return {
    ...prevState,
    status: {
      message: parseDictionary(dictionary.class_remove_student_success, {
        class: className,
        name: studentName,
      }),
      status: 'success',
    },
  };
};
