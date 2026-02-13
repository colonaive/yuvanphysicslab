"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function RouteTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;
    const currentRoute = pathname;
    const previousCurrent = sessionStorage.getItem("currentRoute");

    if (previousCurrent && previousCurrent !== currentRoute) {
      sessionStorage.setItem("previousRoute", previousCurrent);
    }

    sessionStorage.setItem("currentRoute", currentRoute);
  }, [pathname]);

  return null;
}
