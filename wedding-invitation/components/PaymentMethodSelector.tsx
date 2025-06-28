"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CreditCard,
  Coins,
  Zap,
  QrCode,
  Smartphone,
  Shield,
} from "lucide-react";

interface PaymentMethodSelectorProps {
  onMethodChange: (method: "stripe" | "crypto" | "vnpay") => void;
  selectedMethod: "stripe" | "crypto" | "vnpay";
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
            onMethodChange(value as "stripe" | "crypto" | "vnpay")
          }
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger
              value="stripe"
              className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white"
            >
              <CreditCard className="h-4 w-4" />
              <span className="hidden sm:inline">Thẻ tín dụng</span>
              <span className="sm:hidden">Thẻ</span>
              <Badge variant="secondary" className="text-xs">
                Stripe
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="vnpay"
              className="flex items-center gap-2 data-[state=active]:bg-green-500 data-[state=active]:text-white"
            >
              <QrCode className="h-4 w-4" />
              <span className="hidden sm:inline">VNPay QR</span>
              <span className="sm:hidden">QR</span>
              <Badge variant="secondary" className="text-xs">
                VN
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="crypto"
              className="flex items-center gap-2 data-[state=active]:bg-orange-500 data-[state=active]:text-white"
            >
              <Coins className="h-4 w-4" />
              <span className="hidden sm:inline">Tiền điện tử</span>
              <span className="sm:hidden">Crypto</span>
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
                  Thanh toán bằng thẻ quốc tế
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

          <TabsContent value="vnpay" className="mt-4 space-y-3">
            <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-3 mb-2">
                <QrCode className="h-5 w-5 text-green-600" />
                <h3 className="font-semibold text-green-900 dark:text-green-100">
                  Thanh toán VNPay QR
                </h3>
              </div>
              <p className="text-sm text-green-700 dark:text-green-300 mb-3">
                Quét mã QR để thanh toán nhanh chóng với ví điện tử và ngân hàng
                Việt Nam
              </p>
              <div className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400 mb-3">
                <span>✓ Thanh toán tức thì</span>
                <span>✓ Hỗ trợ 24/7</span>
                <span>✓ Phí thấp</span>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1">
                  <Smartphone className="h-3 w-3 text-green-500" />
                  <span className="text-green-700 dark:text-green-300">
                    Mobile Banking
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Shield className="h-3 w-3 text-green-500" />
                  <span className="text-green-700 dark:text-green-300">
                    Bảo mật cao
                  </span>
                </div>
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
