import * as React from "react"
import { cn } from "../../lib/utils"

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  indicatorClassName?: string;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value, indicatorClassName, ...props }, ref) => {
    // Ensure value is between 0 and 100
    const safeValue = Math.min(Math.max(value, 0), 100);
    
    return (
      <div
        ref={ref}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={safeValue}
        className={cn(
          "relative h-2 w-full overflow-hidden rounded-full bg-surface",
          className
        )}
        {...props}
      >
        <div
          className={cn(
            "h-full w-full flex-1 bg-primary transition-all duration-500 ease-out",
            indicatorClassName
          )}
          style={{ transform: `translateX(-${100 - safeValue}%)` }}
        />
      </div>
    )
  }
)
Progress.displayName = "Progress"

export { Progress }
