"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { MainShell } from "@/components/layout/MainShell";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const noShellRoutes = ["/login", "/companion/new", "/quest", "/design-system"];
  const isNoShell = noShellRoutes.some(route => pathname.startsWith(route));

  if (isNoShell) {
    return <>{children}</>;
  }

  return <MainShell>{children}</MainShell>;
}
