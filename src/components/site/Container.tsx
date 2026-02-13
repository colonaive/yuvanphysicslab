import { cn } from "@/lib/utils";
import { spacing } from "@/theme/tokens";
import type { CSSProperties } from "react";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    className?: string;
}

export function Container({ children, className, ...props }: ContainerProps) {
    return (
        <div
            className={cn("mx-auto w-full max-w-6xl px-gutter", className)}
            style={{ "--page-gutter": spacing.pageGutter } as CSSProperties}
            {...props}
        >
            {children}
        </div>
    );
}
