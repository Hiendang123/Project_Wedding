"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, Coins, Zap } from "lucide-react";

interface PaymentMethodSelectorProps {
  onMethodChange: (method: "stripe" | "crypto") => void;
  selectedMethod: "stripe" | "crypto";
  className?: string;
}

export function PaymentMethodSelector({
  onMethodChange,
  selectedMethod,
  className = "",
}: PaymentMethodSelectorProps) {
  return (
    <Card className={`${className} border-2 transition-all duration-300`}>
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Zap className="h-5 w-5 text-yellow-500" />
          Chọn phương thức thanh toán
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs
          value={selectedMethod}
          onValueChange={(value) =>
            onMethodChange(value as "stripe" | "crypto")
          }
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger
              value="stripe"
              className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white"
            >
              <CreditCard className="h-4 w-4" />
              Thẻ tín dụng
              <Badge variant="secondary" className="text-xs">
                Stripe
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="crypto"
              className="flex items-center gap-2 data-[state=active]:bg-orange-500 data-[state=active]:text-white"
            >
              <Coins className="h-4 w-4" />
              Tiền điện tử
              <Badge variant="secondary" className="text-xs">
                ETH
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="stripe" className="mt-4 space-y-3">
            <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-3 mb-2">
                <CreditCard className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                  Thanh toán bằng thẻ
                </h3>
              </div>
              <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                Thanh toán nhanh chóng và an toàn với Visa, Mastercard, hoặc
                American Express
              </p>
              <div className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400">
                <span>✓ Bảo mật SSL</span>
                <span>✓ Xử lý tức thì</span>
                <span>✓ Hỗ trợ 24/7</span>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="crypto" className="mt-4 space-y-3">
            <div className="bg-orange-50 dark:bg-orange-950/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
              <div className="flex items-center gap-3 mb-2">
                <Coins className="h-5 w-5 text-orange-600" />
                <h3 className="font-semibold text-orange-900 dark:text-orange-100">
                  Thanh toán bằng Ethereum
                </h3>
              </div>
              <p className="text-sm text-orange-700 dark:text-orange-300 mb-3">
                Thanh toán phi tập trung với Ethereum trên mạng Sepolia testnet
              </p>
              <div className="flex items-center gap-2 text-xs text-orange-600 dark:text-orange-400">
                <span>✓ Không trung gian</span>
                <span>✓ Phí thấp</span>
                <span>✓ Minh bạch</span>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
