"use client";

import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface SmartBackButtonProps {
  fallbackHref: string;
  label?: string;
  className?: string;
}

export function SmartBackButton({
  fallbackHref,
  label = "Back",
  className,
}: SmartBackButtonProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleBack = () => {
    const previousRoute = sessionStorage.getItem("previousRoute");
    const hasInternalReferrer =
      typeof document !== "undefined" &&
      document.referrer.startsWith(window.location.origin);

    if (previousRoute && previousRoute !== pathname) {
      router.push(previousRoute);
      return;
    }

    if (hasInternalReferrer && window.history.length > 1) {
      router.back();
      return;
    }

    router.push(fallbackHref);
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      className={cn(
        "inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-text",
        className
      )}
    >
      <ArrowLeft className="h-4 w-4" />
      {label}
    </button>
  );
}
