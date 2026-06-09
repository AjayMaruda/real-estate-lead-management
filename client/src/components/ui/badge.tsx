import { cn } from "../../lib/utils";
import type { HTMLAttributes } from "react";

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-slate-200/80 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700 shadow-sm",
        className,
      )}
      {...props}
    />
  );
}
