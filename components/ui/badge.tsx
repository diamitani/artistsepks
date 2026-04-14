import * as React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.ComponentProps<"span"> {
  variant?: "default" | "gold" | "outline" | "red";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded px-2 py-0.5 text-xs font-medium uppercase tracking-wider",
        variant === "default" && "bg-secondary text-secondary-foreground",
        variant === "gold" && "bg-[#C9A227]/20 text-[#C9A227] border border-[#C9A227]/30",
        variant === "outline" && "border border-border text-muted-foreground",
        variant === "red" && "bg-[#C8102E]/20 text-[#C8102E] border border-[#C8102E]/30",
        className
      )}
      {...props}
    />
  );
}

export { Badge };
