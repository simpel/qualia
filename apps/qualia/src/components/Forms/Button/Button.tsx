'use client';

import { ButtonProps, Button as UIButton } from '@/shadcn/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useFormStatus } from 'react-dom';

export interface IButton extends ButtonProps {
  pendingText?: string;
  pending?: boolean;
}

export const Button = ({
  children,
  pendingText,
  pending,
  type,
  ...props
}: IButton) => {
  const formStatus = useFormStatus();

  const isPending = pending || formStatus.pending;

  console.log({ pending });

  return (
    <UIButton type={type} disabled={isPending} {...props}>
      {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {isPending ? pendingText : children}
    </UIButton>
  );
};
