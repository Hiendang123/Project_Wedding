"use client";

import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";

interface WalletWrapperProps {
  children: React.ReactNode;
}

export function WalletWrapper({ children }: WalletWrapperProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // 🏴‍☠️ Double check for client-side environment - GenG style!
    setIsClient(typeof window !== "undefined");
    setIsMounted(true);
  }, []);

  // 🎯 Show loading while hydrating - GenG approved!
  if (!isMounted || !isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
        <Spinner size="lg" />
      </div>
    );
  }

  // 🏴‍☠️ Additional check for browser APIs - GenG style!
  if (typeof window === "undefined" || typeof document === "undefined") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
        <Spinner size="lg" />
      </div>
    );
  }

  return <>{children}</>;
}
