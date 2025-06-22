"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Template } from "@/interface/Template";
import dynamic from "next/dynamic";

interface CryptoPaymentSafeProps {
  template: Template;
  onSuccess: (transactionHash: string) => void;
  onError: (error: string) => void;
  className?: string;
}

// 🏴‍☠️ Loading component - GenG style!
const LoadingCard = ({ className }: { className?: string }) => (
  <Card className={`${className} border-orange-200 dark:border-orange-800`}>
    <CardContent className="text-center space-y-4 p-6">
      <Spinner size="lg" />
      <p className="text-gray-600 dark:text-gray-300">
        Đang khởi tạo ví crypto...
      </p>
    </CardContent>
  </Card>
);

export function CryptoPaymentSafe({
  template,
  onSuccess,
  onError,
  className = "",
}: CryptoPaymentSafeProps) {
  const [isClient, setIsClient] = useState(false);
  const [CryptoComponent, setCryptoComponent] = useState<any>(null);

  useEffect(() => {
    // 🎯 Only load crypto component on client-side - GenG approved!
    if (typeof window !== "undefined") {
      setIsClient(true);

      // 🏴‍☠️ Dynamic import after client-side detection - GenG style!
      import("@/components/CryptoPaymentClient")
        .then((mod) => {
          setCryptoComponent(() => mod.CryptoPaymentClient);
        })
        .catch((error) => {
          console.error("Failed to load crypto payment:", error);
          onError("Không thể tải thành phần thanh toán crypto");
        });
    }
  }, [onError]);

  // 🏴‍☠️ Show loading while not ready - GenG style!
  if (!isClient || !CryptoComponent) {
    return <LoadingCard className={className} />;
  }

  return (
    <CryptoComponent
      template={template}
      onSuccess={onSuccess}
      onError={onError}
      className={className}
    />
  );
}
