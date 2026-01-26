import { cn } from "@/lib/utils";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    className?: string;
}

export function Container({ children, className, ...props }: ContainerProps) {
    return (
        <div
            className={cn("mx-auto w-full max-w-3xl px-6 md:px-8", className)}
            {...props}
        >
            {children}
        </div>
    );
}
