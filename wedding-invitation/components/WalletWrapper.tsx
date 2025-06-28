"use client";

import { Spinner } from "@/components/ui/spinner";
import { useHydration } from "@/hooks/useHydration";

interface WalletWrapperProps {
  children: React.ReactNode;
}

export function WalletWrapper({ children }: WalletWrapperProps) {
  const isHydrated = useHydration();

  // 🎯 Always show loading during SSR and hydration - GenG approved!
  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
        <div className="text-center space-y-4">
          <Spinner size="lg" />
          <p className="text-gray-600 dark:text-gray-400">
            Đang tải ứng dụng...
          </p>
        </div>
      </div>
    );
  }

  // 🚀 Render children after successful hydration
  return <>{children}</>;
}
