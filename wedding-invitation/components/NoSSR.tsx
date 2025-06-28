"use client";

import { ReactNode } from "react";
import { useHydration } from "@/hooks/useHydration";

interface NoSSRProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * 🏴‍☠️ NoSSR component to prevent hydration mismatches - GenG style!
 * Use this for components that should only render on client side
 */
export function NoSSR({ children, fallback = null }: NoSSRProps) {
  const isHydrated = useHydration();

  if (!isHydrated) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
