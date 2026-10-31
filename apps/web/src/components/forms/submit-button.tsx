'use client';

import { Button } from '@repo/ui/components/button';
import { useFormStatus } from 'react-dom';

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" size="lg" disabled={pending}>
      {pending ? 'Sending...' : 'Send Message'}
    </Button>
  );
}

export { SubmitButton };
