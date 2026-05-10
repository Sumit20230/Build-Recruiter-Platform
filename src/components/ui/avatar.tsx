import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cn } from "@/lib/utils";

export const Avatar = ({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Root>) => (
  <AvatarPrimitive.Root className={cn("relative flex h-11 w-11 shrink-0 overflow-hidden rounded-full", className)} {...props} />
);
export const AvatarImage = ({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Image>) => (
  <AvatarPrimitive.Image className={cn("aspect-square h-full w-full object-cover", className)} {...props} />
);
export const AvatarFallback = ({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Fallback>) => (
  <AvatarPrimitive.Fallback className={cn("flex h-full w-full items-center justify-center bg-slate-100 text-sm font-semibold text-slate-700", className)} {...props} />
);
