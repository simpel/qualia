'use client';

import { ButtonProps, Button as UIButton } from '@/shadcn/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useFormStatus } from 'react-dom';

export interface IButton extends ButtonProps {
  pendingText?: string;
}

export const Button = ({ children, pendingText, type, ...props }: IButton) => {
  const { pending } = useFormStatus();

  return (
    <UIButton type={type} disabled={pending} {...props}>
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {pending ? pendingText : children}
    </UIButton>
  );
};
