import * as React from "react"
import { Slot as RadixSlot } from "@radix-ui/react-slot"

import { cn } from "@/lib/utils"

export interface SlotProps extends React.HTMLAttributes<HTMLElement> {
  asChild?: boolean
}

const Slot = React.forwardRef<HTMLElement, SlotProps>(
  ({ className, asChild = false, ...props }, ref) => {
    if (asChild) {
      return (
        <RadixSlot
          ref={ref}
          className={cn(className)}
          {...props}
        />
      )
    }
    
    // When not asChild, we render a div
    return (
      <div
        ref={ref as React.Ref<HTMLDivElement>}
        className={cn(className)}
        {...props}
      />
    )
  }
)
Slot.displayName = "Slot"

export { Slot }

