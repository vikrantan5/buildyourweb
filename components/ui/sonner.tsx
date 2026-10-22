'use client';

import { Toaster as Sonner } from 'sonner';

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return <Sonner theme="dark" className="toaster group" toastOptions={{
    classNames: {
      toast: 'group toast bg-panel border-white/10 text-white',
      description: 'group-[.toast]:text-white/60',
    },
  }} {...props} />;
};

export { Toaster };
