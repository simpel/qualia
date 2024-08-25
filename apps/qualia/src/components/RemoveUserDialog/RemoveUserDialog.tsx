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
  profile: {
    id: Tables<'profiles'>['id'];
    email: Tables<'profiles'>['email'];
    first_name: Tables<'profiles'>['first_name'];
    last_name: Tables<'profiles'>['last_name'];
  };
}

export const RemoveUserDialog = ({
  children,
  currentClass,
  profile,
}: IRemoveUserAlertDialog) => {
  const [state, formAction] = useFormState(removeStudentFromClass, {
    status: undefined,
  });

  const [open, setOpen] = useState(false);

  const name =
    profile.first_name === null && profile.last_name === null
      ? profile.email
      : `${profile.first_name} ${profile.last_name}`;

  useEffect(() => {
    if (state instanceof Error) {
      toast.error(state.message);
    } else {
      if (state.status !== undefined) {
        toast[state.status.status](state.status.message);
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
              name: name,
              class: currentClass.name,
            })}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>

          <form action={formAction}>
            <input type="hidden" name="profile_id" value={profile.id} />
            <input type="hidden" name="class_id" value={currentClass.id} />
            <input type="hidden" name="class_name" value={currentClass.name} />
            <input type="hidden" name="student_name" value={name} />

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
