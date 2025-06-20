"use client";

import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";

interface WalletWrapperProps {
  children: React.ReactNode;
}

export function WalletWrapper({ children }: WalletWrapperProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
        <Spinner size="lg" />
      </div>
    );
  }

  return <>{children}</>;
}
