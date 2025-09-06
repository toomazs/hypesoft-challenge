import * as React from "react"
import { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

export interface IconProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: LucideIcon
  size?: number
}

const Icon = React.forwardRef<HTMLDivElement, IconProps>(
  ({ className, icon: IconComponent, size = 16, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center justify-center", className)}
      {...props}
    >
      <IconComponent size={size} />
    </div>
  )
)
Icon.displayName = "Icon"

export { Icon }

