import { cn } from "../../lib/utils";
import type { SelectHTMLAttributes } from "react";

export function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "h-11 w-full rounded-2xl border border-slate-200/80 bg-white/90 px-4 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200/70",
        className,
      )}
      {...props}
    />
  );
}
