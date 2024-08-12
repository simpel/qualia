'use client';

import { ButtonProps, Button as RadixButton, Spinner } from '@radix-ui/themes';
import { useFormStatus } from 'react-dom';

export interface IButton extends ButtonProps {
  pendingText?: string;
}

export const Button = (buttonProps: IButton) => {
  const { children, pendingText, ...props } = buttonProps;
  const { pending } = useFormStatus();

  return (
    <RadixButton {...props} disabled={pending} className="w-full">
      {pending ? pendingText : children} {pending && <Spinner />}
    </RadixButton>
  );
};
