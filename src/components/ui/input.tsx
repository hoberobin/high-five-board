import * as React from "react";
import { cn } from "../../lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // Base styles
        "flex w-full h-10 rounded-lg border border-input bg-white/80 px-3 py-2 text-sm text-foreground shadow-sm transition-colors",
        "placeholder:text-muted-foreground selection:bg-primary/20 selection:text-foreground ",
        
        // Focus state
        "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary",
        
        // Disabled state
        "disabled:cursor-not-allowed disabled:opacity-50",
        
        // File inputs
        "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
        
        // Invalid state
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20",
        
        className
      )}
      {...props}
    />
  );
}

export { Input };