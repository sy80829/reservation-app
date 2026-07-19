'use client';

import { useFormStatus } from 'react-dom';
import { cn } from '@/lib/utils';

type Props = {
  children: React.ReactNode;
  pendingText: string;
  className?: string;
};

export default function FormSubmitButton({
  children,
  pendingText,
  className,
}: Props) {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending} className={cn(className)}>
      {pending ? pendingText : children}
    </button>
  );
}
