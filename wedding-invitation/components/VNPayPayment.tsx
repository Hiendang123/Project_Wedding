"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  QrCode,
  Smartphone,
  CreditCard,
  Building2,
  AlertCircle,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

interface VNPayPaymentProps {
  amount: number;
  orderInfo: string;
  orderId: string;
  onSuccess: (transactionId: string) => void;
  onError: (error: string) => void;
  className?: string;
}

export function VNPayPayment({
  amount,
  orderInfo,
  orderId,
  onSuccess,
  onError,
  className = "",
}: VNPayPaymentProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBankCode, setSelectedBankCode] = useState<string>("VNPAYQR");
  const [error, setError] = useState<string | null>(null);

  // 🏴‍☠️ Bank options for VNPay - GenG style!
  const bankOptions = [
    {
      code: "VNPAYQR",
      name: "VNPay QR Code",
      description: "Quét mã QR để thanh toán",
      icon: QrCode,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-950/20",
      borderColor: "border-green-200 dark:border-green-800",
      popular: true,
    },
    {
      code: "VNBANK",
      name: "ATM/Internet Banking",
      description: "Thẻ ATM & Tài khoản ngân hàng",
      icon: Building2,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950/20",
      borderColor: "border-blue-200 dark:border-blue-800",
    },
    {
      code: "INTCARD",
      name: "Thẻ quốc tế",
      description: "Visa, Mastercard, JCB",
      icon: CreditCard,
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-950/20",
      borderColor: "border-purple-200 dark:border-purple-800",
    },
  ];

  // 🎯 Popular Vietnamese banks - GenG approved!
  const popularBanks = [
    { code: "VCB", name: "Vietcombank", logo: "🏦" },
    { code: "TCB", name: "Techcombank", logo: "🏛️" },
    { code: "MB", name: "MB Bank", logo: "🏦" },
    { code: "ACB", name: "ACB", logo: "🏛️" },
    { code: "VIB", name: "VIB", logo: "🏦" },
    { code: "BIDV", name: "BIDV", logo: "🏛️" },
  ];

  const selectedBank = bankOptions.find(
    (bank) => bank.code === selectedBankCode
  );

  const handleVNPayPayment = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // 🚀 Call API to create VNPay payment URL
      const response = await fetch("/api/vnpay/create-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount,
          orderInfo,
          orderId,
          bankCode: selectedBankCode,
        }),
      });

      if (!response.ok) {
        throw new Error("Không thể tạo liên kết thanh toán");
      }

      const { paymentUrl, error: apiError } = await response.json();

      if (apiError) {
        throw new Error(apiError);
      }

      if (!paymentUrl) {
        throw new Error("Không nhận được URL thanh toán");
      }

      // 🏴‍☠️ Redirect to VNPay payment page - GenG style!
      console.log("🏴‍☠️ Redirecting to VNPay:", paymentUrl);
      window.location.href = paymentUrl;
    } catch (error: any) {
      console.error("VNPay payment error:", error);
      const errorMessage =
        error.message || "Đã xảy ra lỗi khi tạo thanh toán VNPay";
      setError(errorMessage);
      onError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className={`${className} border-2 transition-all duration-300`}>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <QrCode className="h-5 w-5 text-green-500" />
          Thanh toán VNPay
          <Badge
            variant="secondary"
            className="text-xs bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300"
          >
            Phổ biến
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Amount Display */}
        <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Số tiền thanh toán:
            </span>
            <span className="text-xl font-bold text-green-600 dark:text-green-400">
              {amount.toLocaleString("vi-VN")} VNĐ
            </span>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {orderInfo}
          </div>
        </div>

        {/* Bank Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Chọn phương thức thanh toán:
          </label>

          <div className="grid gap-3">
            {bankOptions.map((bank) => {
              const Icon = bank.icon;
              const isSelected = selectedBankCode === bank.code;

              return (
                <div
                  key={bank.code}
                  className={`
                    relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
                    ${
                      isSelected
                        ? `${bank.borderColor} ${bank.bgColor}`
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                    }
                  `}
                  onClick={() => setSelectedBankCode(bank.code)}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`h-5 w-5 ${
                        isSelected ? bank.color : "text-gray-400"
                      }`}
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-medium ${
                            isSelected
                              ? bank.color
                              : "text-gray-700 dark:text-gray-300"
                          }`}
                        >
                          {bank.name}
                        </span>
                        {bank.popular && (
                          <Badge variant="secondary" className="text-xs">
                            Phổ biến
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {bank.description}
                      </p>
                    </div>
                    <div
                      className={`w-4 h-4 rounded-full border-2 ${
                        isSelected
                          ? `${bank.color.replace(
                              "text-",
                              "border-"
                            )} ${bank.color.replace("text-", "bg-")}`
                          : "border-gray-300 dark:border-gray-600"
                      }`}
                    >
                      {isSelected && (
                        <CheckCircle className="w-3 h-3 text-white m-0.5" />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Popular Banks for VNBANK */}
        {selectedBankCode === "VNBANK" && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Ngân hàng phổ biến:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {popularBanks.map((bank) => (
                <Button
                  key={bank.code}
                  variant="outline"
                  size="sm"
                  className="justify-start text-xs"
                  onClick={() => setSelectedBankCode(bank.code)}
                >
                  <span className="mr-1">{bank.logo}</span>
                  {bank.name}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Payment Button */}
        <Button
          onClick={handleVNPayPayment}
          disabled={isLoading}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 text-base"
        >
          {isLoading ? (
            <>
              <Spinner size="sm" className="mr-2" />
              Đang xử lý...
            </>
          ) : (
            <>
              {selectedBank && <selectedBank.icon className="mr-2 h-5 w-5" />}
              Thanh toán {amount.toLocaleString("vi-VN")} VNĐ
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>

        {/* Security Info */}
        <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-2">
            <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-blue-700 dark:text-blue-300">
              <p className="font-medium mb-1">Thanh toán an toàn với VNPay</p>
              <ul className="space-y-1 text-blue-600 dark:text-blue-400">
                <li>• Mã hóa SSL 256-bit</li>
                <li>• Được cấp phép bởi Ngân hàng Nhà nước</li>
                <li>• Hỗ trợ 24/7: 1900 55 55 77</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
