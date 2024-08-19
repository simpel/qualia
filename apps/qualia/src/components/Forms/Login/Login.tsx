'use client';

import { Input } from '@/shadcn/components/ui/input';
import { Label } from '@/shadcn/components/ui/label';
import dictionary from '@qualia/dictionary';
import { ReactNode, useEffect } from 'react';
import { useFormState } from 'react-dom';
import { toast } from 'sonner';
import { IMagicLink, sendMagicLink } from '../../../actions/sendMagicLink';
import { Button } from '../Button/Button';

const LoginForm = ({ children }: { children: ReactNode }) => {
  const [state, formAction] = useFormState<IMagicLink>(sendMagicLink, {
    message: undefined,
    status: undefined,
  });

  useEffect(() => {
    if (state.status === 'success') {
      toast.success(state.message);
    } else {
      toast.error(state.message);
    }

    console.log(state);
  }, [state]);

  return (
    <div className="relative w-full">
      {state.status === undefined && (
        <form
          className={`inset absolute flex w-full flex-1 flex-col justify-center gap-2 text-foreground`}
          action={formAction}
        >
          <input type="hidden" name="path" value={'/'} />
          {children}
          <Label htmlFor="email" className="my-2 mt-6">
            {dictionary['fields_email']}
          </Label>
          <Input
            className="w-[280px]"
            name="email"
            placeholder={dictionary['fields_email_placeholder']}
            required
          />

          <Button
            type="submit"
            pendingText={dictionary['sending_magic_link']}
            className="w-[280px]"
          >
            {dictionary['send_magic_link']}
          </Button>
        </form>
      )}
      {state.status === 'success' && (
        <div>
          <p className="my-2 mt-2 text-xl text-gray-400">{state.message}</p>
        </div>
      )}
    </div>
  );
};

export default LoginForm;
