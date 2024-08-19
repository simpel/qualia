'use server';

import { IStatus } from '@/types/generic';
import { parseDictionary } from '@/utils/dictionary/dictionary';
import dictionary from '@qualia/dictionary';
import { revalidatePath } from 'next/cache';
import { createClient } from '../utils/clients/server';
import { getUser } from '../utils/server/user';

export interface IRemoveStudentFromClass {
  status?: IStatus;
}

export const removeStudentFromClass = async (
  prevState: IRemoveStudentFromClass,
  formData: FormData,
): Promise<Error | IRemoveStudentFromClass> => {
  const supabase = createClient();
  const user = await getUser();

  if (!user) return new Error('User not found');

  const userId = formData.get('user_id') as string;
  const classId = formData.get('class_id') as string;
  const className = formData.get('class_name') as string;
  const studentName = formData.get('student_name') as string;

  console.log({ prevState });

  const { error } = await supabase
    .from('classes_users')
    .delete()
    .eq('class_id', classId)
    .eq('user_id', userId);

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
