import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-electric/15 text-electric',
        success: 'border-transparent bg-emerald-500/15 text-emerald-300',
        warning: 'border-transparent bg-amber-500/15 text-amber-300',
        muted: 'border-white/10 bg-white/5 text-white/60',
        violet: 'border-transparent bg-violett/20 text-violet-300',
        outline: 'border-white/15 text-white/70',
      },
    },
    defaultVariants: { variant: 'default' },
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
