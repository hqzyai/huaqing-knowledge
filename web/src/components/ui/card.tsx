import * as React from 'react';

import { cn } from '@/lib/utils';

const Card = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement> & { as?: React.ElementType }
>(({ as: As = 'div', className, ...props }, ref) => (
  <As
    ref={ref}
    className={cn(
      'rounded-3xl border-border-button border shadow-none bg-card text-card-foreground',
      className,
    )}
    {...props}
  />
));
Card.displayName = 'Card';

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { as?: React.ElementType }
>(({ as: As = 'div', className, ...props }, ref) => (
  <As
    ref={ref}
    className={cn('flex flex-col space-y-1.5 p-5', className)}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement> & { as?: React.ElementType }
>(({ as: As = 'div', className, ...props }, ref) => (
  <As ref={ref} className={cn('text-card-title', className)} {...props} />
));
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { as?: React.ElementType }
>(({ as: As = 'div', className, ...props }, ref) => (
  <As
    ref={ref}
    className={cn('text-ui-caption text-text-secondary', className)}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { as?: React.ElementType }
>(({ as: As = 'div', className, ...props }, ref) => (
  <As ref={ref} className={cn('p-5 pt-0', className)} {...props} />
));
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { as?: React.ElementType }
>(({ as: As = 'div', className, ...props }, ref) => (
  <As
    ref={ref}
    className={cn('flex items-center p-5 pt-0', className)}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';

export {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
};
