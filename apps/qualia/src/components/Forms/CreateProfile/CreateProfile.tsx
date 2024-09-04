'use client';

import { Input } from '@/shadcn/components/ui/input';
import { Label } from '@/shadcn/components/ui/label';
import { IStatus } from '@/types/generic';
import dictionary from '@qualia/dictionary';
import { User } from '@supabase/supabase-js';
import { useEffect } from 'react';
import { useFormState } from 'react-dom';
import { toast } from 'sonner';
import { createProfile } from '../../../actions/createProfile';
import { Button } from '../Button/Button';

export type ICreateProfile = {
  email: User['email'];
};

const CreateProfileForm = ({ email }: ICreateProfile) => {
  const [state, formAction] = useFormState(createProfile, {} as IStatus);

  useEffect(() => {
    if (state instanceof Error) {
      toast.error(state.message);
    } else {
      // @ts-ignore
      toast[state.status](dictionary[state.message]);
    }
  }, [state]);

  return (
    <form action={formAction}>
      <div className="flex flex-col gap-6">
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="first_name">{dictionary.your_first_name}</Label>
          <Input name="first_name" type="text" />
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="last_name">{dictionary.your_last_name}</Label>
          <Input name="last_name" type="text" />
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="email">{dictionary.fields_email}</Label>
          <Input
            name="email"
            type="email"
            defaultValue={email}
            placeholder={dictionary.fields_email_placeholder}
          />
        </div>
      </div>

      <Button
        className="mt-4"
        type="submit"
        pendingText={dictionary.creating_profile}
      >
        {dictionary.create_profile}
      </Button>
    </form>
  );
};

export default CreateProfileForm;
