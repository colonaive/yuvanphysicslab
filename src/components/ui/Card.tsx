import type React from "react";
import { cn } from "@/lib/utils";
import { semanticClasses } from "@/theme/tokens";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  muted?: boolean;
}

export function Card({ muted = false, className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        muted ? semanticClasses.cardMuted : semanticClasses.card,
        className
      )}
      {...props}
    />
  );
}
