import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { PenTool, Home } from "lucide-react";

export function LabNav() {
    const pathname = usePathname();

    const links = [
        { href: "/lab", label: "Dashboard", icon: Home },
        { href: "/lab/latex", label: "Scratchpad", icon: PenTool },
    ];

    return (
        <nav className="flex items-center gap-2 rounded-card border border-border bg-surface2 p-1.5">
            {links.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={cn(
                            "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                            isActive
                                ? "bg-surface text-text shadow-soft"
                                : "text-muted hover:text-accent hover:bg-surface"
                        )}
                    >
                        <Icon className="h-4 w-4" />
                        <span className="hidden md:inline">{link.label}</span>
                    </Link>
                );
            })}
        </nav>
    );
}
