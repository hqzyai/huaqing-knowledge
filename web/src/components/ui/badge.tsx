import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-xs border px-1.5 py-0.5 min-h-[22px] text-ui-caption font-medium transition-colors outline-none focus:outline-none',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-secondary text-secondary-foreground',
        secondary:
          'border-transparent bg-bg-card text-text-secondary rounded-xs',
        success:
          'border-transparent bg-state-success/5 text-state-success rounded-xs',
        destructive:
          'border-transparent bg-state-error/5 text-state-error rounded-xs',
        outline: 'text-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export interface BadgeProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
