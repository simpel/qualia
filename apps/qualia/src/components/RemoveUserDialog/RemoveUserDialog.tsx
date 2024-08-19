'use client';

import { removeStudentFromClass } from '@/actions/removeStudentFromClass';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/shadcn/components/ui/alert-dialog';
import { Tables } from '@/types/supabase';
import { parseDictionary } from '@/utils/dictionary/dictionary';
import dictionary from '@qualia/dictionary';
import { ReactNode, useEffect, useState } from 'react';
import { useFormState } from 'react-dom';
import 'react-multi-email/dist/style.css';
import { toast } from 'sonner';
import { Button } from '../Forms/Button/Button';

interface IRemoveUserAlertDialog {
  children: ReactNode;
  currentClass: Tables<'classes'>;
  user: {
    user_id: Tables<'profiles'>['user_id'];
    first_name: Tables<'profiles'>['first_name'];
    last_name: Tables<'profiles'>['last_name'];
  };
}

export const RemoveUserDialog = ({
  children,
  currentClass,
  user,
}: IRemoveUserAlertDialog) => {
  const [state, formAction] = useFormState(removeStudentFromClass, {
    status: undefined,
  });

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (state instanceof Error) {
      toast.error(state.message);
    } else {
      if (state.status !== undefined) {
        toast[state.status.status === 'success' ? 'success' : 'error'](
          state.status.message,
        );
        setOpen(false);
      }
    }
  }, [state]);
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-[425px]">
        <AlertDialogHeader>
          <AlertDialogTitle>{dictionary.remove_student}</AlertDialogTitle>
          <AlertDialogDescription>
            {parseDictionary(dictionary.class_remove_student_description, {
              name: `${user.first_name} ${user.last_name}`,
              class: currentClass.name,
            })}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>

          <form action={formAction}>
            <input type="hidden" name="user_id" value={user.user_id} />
            <input type="hidden" name="class_id" value={currentClass.id} />
            <input type="hidden" name="class_name" value={currentClass.name} />
            <input
              type="hidden"
              name="student_name"
              value={`${user.first_name} ${user.last_name}`}
            />

            <Button
              type="submit"
              variant={'destructive'}
              pendingText={dictionary.removing_student}
            >
              {dictionary.remove_student}
            </Button>
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
