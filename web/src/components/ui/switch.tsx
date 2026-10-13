'use client';

import * as SwitchPrimitives from '@radix-ui/react-switch';
import * as React from 'react';

import { cn } from '@/lib/utils';

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => {
  const switchId = React.useId();

  return (
    <SwitchPrimitives.Root
      className={cn(
        'group/switch inline-flex h-[18px] w-8 shrink-0 cursor-pointer items-center rounded-full',
        'border-2 border-transparent overflow-hidden transition-colors',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'data-[state=checked]:bg-accent-primary data-[state=unchecked]:bg-text-sub-title',
        className,
      )}
      {...props}
      // Own the switch id, like `SelectWithSearch` does. Radix's Slot lets
      // child props win, so this keeps shadcn's `FormControl` from putting the
      // form item id here — otherwise a `FormLabel` (`<label htmlFor>`) would
      // forward its clicks to this switch, making the whole label row toggle it.
      id={switchId}
      ref={ref}
    >
      <SwitchPrimitives.Thumb
        className="
        pointer-events-none block size-3.5 rounded-full bg-primary-foreground shadow-none ring-0 transition-[width,transform] ease-out motion-reduce:transition-none
        group-hover/switch:w-4 group-focus-visible/switch:w-4
        data-[state=checked]:translate-x-3.5 data-[state=unchecked]:translate-x-0
        group-hover/switch:data-[state=checked]:translate-x-3 group-focus-visible/switch:data-[state=checked]:translate-x-3
      "
      />
    </SwitchPrimitives.Root>
  );
});
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
