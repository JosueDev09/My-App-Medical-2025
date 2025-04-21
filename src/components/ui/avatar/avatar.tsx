// src/components/ui/avatar.tsx

import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cn } from "@/lib/utils"; // Esta es una utilidad para clases de Tailwind (opcional)

export const Avatar = React.forwardRef<HTMLDivElement, React.HTMLProps<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <AvatarPrimitive.Root
      ref={ref}
      className={cn("inline-flex items-center justify-center", className)}
      {...props}
    />
  )
);

Avatar.displayName = "Avatar";

export const AvatarImage = React.forwardRef<HTMLImageElement, React.ImgHTMLAttributes<HTMLImageElement>>(
  ({ className, ...props }, ref) => (
    <AvatarPrimitive.Image
      ref={ref}
      className={cn("rounded-full object-cover", className)}
      {...props}
    />
  )
);

AvatarImage.displayName = "AvatarImage";

export const AvatarFallback = React.forwardRef<HTMLSpanElement, React.HTMLProps<HTMLSpanElement>>(
  ({ className, ...props }, ref) => (
    <AvatarPrimitive.Fallback
      ref={ref}
      className={cn("flex items-center justify-center w-full h-full text-sm", className)}
      {...props}
    />
  )
);

AvatarFallback.displayName = "AvatarFallback";
