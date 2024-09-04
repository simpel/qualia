'use client';

import { removeProfile } from '@/actions/removeProfile';
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
import { createName } from '@/utils/profle/createName/createName';
import dictionary from '@qualia/dictionary';
import { ReactNode, useEffect, useState } from 'react';
import { useFormState } from 'react-dom';
import 'react-multi-email/dist/style.css';
import { toast } from 'sonner';
import { Button } from '../Forms/Button/Button';

interface IRemoveProfileAlertDialog {
  children: ReactNode;
  path?: string;
  profile: Tables<'profiles'>;
}

export const RemoveProfile = ({
  children,
  path,
  profile,
}: IRemoveProfileAlertDialog) => {
  const [state, formAction] = useFormState(removeProfile, {
    status: undefined,
  });

  const [open, setOpen] = useState(false);

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
          <AlertDialogTitle>{dictionary.remove_profile}</AlertDialogTitle>
          <AlertDialogDescription>
            {parseDictionary(dictionary.remove_profile_info, {
              name: createName(profile) || profile.email,
            })}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>{dictionary.cancel}</AlertDialogCancel>

          <form action={formAction}>
            <input type="hidden" name="profile_id" value={profile.id} />
            <input type="hidden" name="path" value={path} />
            <input
              type="hidden"
              name="name"
              value={createName(profile) || profile.email}
            />

            <Button
              type="submit"
              variant={'destructive'}
              pendingText={dictionary.removing_profile}
            >
              {dictionary.remove_profile}
            </Button>
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
