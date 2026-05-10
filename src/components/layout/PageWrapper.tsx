import type { PropsWithChildren } from "react";
import { cn } from "@/lib/utils";

export function PageWrapper({ children, className }: PropsWithChildren<{ className?: string }>) {
  return <main className={cn("mx-auto min-h-[calc(100vh-8rem)] max-w-6xl px-4 py-8", className)}>{children}</main>;
}
