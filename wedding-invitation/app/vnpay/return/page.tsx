"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowLeft,
  Home,
  CreditCard,
  Clock,
} from "lucide-react";

interface PaymentResult {
  isValid: boolean;
  isSuccess: boolean;
  message: string;
  data?: {
    vnp_Amount: string;
    vnp_BankCode: string;
    vnp_BankTranNo: string;
    vnp_CardType: string;
    vnp_OrderInfo: string;
    vnp_PayDate: string;
    vnp_ResponseCode: string;
    vnp_TmnCode: string;
    vnp_TransactionNo: string;
    vnp_TransactionStatus: string;
    vnp_TxnRef: string;
  };
}

export default function VNPayReturnPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [paymentResult, setPaymentResult] = useState<PaymentResult | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // 🏴‍☠️ Get all VNPay parameters from URL - GenG style!
        const vnpParams: Record<string, string> = {};
        for (const [key, value] of searchParams.entries()) {
          if (key.startsWith("vnp_")) {
            vnpParams[key] = value;
          }
        }

        console.log("🏴‍☠️ VNPay return params:", {
          vnp_TxnRef: vnpParams.vnp_TxnRef,
          vnp_ResponseCode: vnpParams.vnp_ResponseCode,
          vnp_TransactionStatus: vnpParams.vnp_TransactionStatus,
        });

        if (!vnpParams.vnp_TxnRef) {
          setPaymentResult({
            isValid: false,
            isSuccess: false,
            message: "Không tìm thấy thông tin giao dịch",
          });
          return;
        }

        // 🔍 Verify payment with backend
        const response = await fetch("/api/vnpay/verify-return", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(vnpParams),
        });

        if (!response.ok) {
          throw new Error("Không thể xác thực kết quả thanh toán");
        }

        const result = await response.json();
        setPaymentResult(result);

        // 🎉 If payment successful, trigger success callback after delay
        if (result.isSuccess && result.data) {
          console.log(
            "🎉 VNPay payment successful, creating wedding invitation..."
          );

          // 🏴‍☠️ Here we can trigger the wedding invitation creation
          // For now, we'll redirect to templates page after 3 seconds
          setTimeout(() => {
            router.push("/templates?payment=vnpay_success");
          }, 3000);
        }
      } catch (error: any) {
        console.error("🚨 VNPay return verification error:", error);
        setPaymentResult({
          isValid: false,
          isSuccess: false,
          message: error.message || "Đã xảy ra lỗi khi xác thực thanh toán",
        });
      } finally {
        setIsLoading(false);
      }
    };

    verifyPayment();
  }, [searchParams, router]);

  // 🎯 Format amount for display - GenG style!
  const formatAmount = (amount: string) => {
    const numAmount = parseInt(amount) / 100; // VNPay amount is multiplied by 100
    return numAmount.toLocaleString("vi-VN");
  };

  // 🎯 Format date for display
  const formatDate = (dateStr: string) => {
    if (!dateStr || dateStr.length !== 14) return dateStr;

    const year = dateStr.substring(0, 4);
    const month = dateStr.substring(4, 6);
    const day = dateStr.substring(6, 8);
    const hour = dateStr.substring(8, 10);
    const minute = dateStr.substring(10, 12);
    const second = dateStr.substring(12, 14);

    return `${day}/${month}/${year} ${hour}:${minute}:${second}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-white dark:bg-black">
        <Header />
        <main className="flex-1 container mx-auto py-8 px-4 flex items-center justify-center">
          <Card className="max-w-md w-full">
            <CardContent className="text-center space-y-4 p-8">
              <Spinner size="lg" />
              <h2 className="text-xl font-semibold">
                Đang xác thực thanh toán...
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Vui lòng chờ trong giây lát
              </p>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  const getStatusIcon = () => {
    if (!paymentResult?.isValid)
      return <AlertCircle className="h-16 w-16 text-yellow-500" />;
    if (paymentResult.isSuccess)
      return <CheckCircle className="h-16 w-16 text-green-500" />;
    return <XCircle className="h-16 w-16 text-red-500" />;
  };

  const getStatusColor = () => {
    if (!paymentResult?.isValid)
      return "border-yellow-200 dark:border-yellow-800";
    if (paymentResult.isSuccess)
      return "border-green-200 dark:border-green-800";
    return "border-red-200 dark:border-red-800";
  };

  const getStatusBg = () => {
    if (!paymentResult?.isValid) return "bg-yellow-50 dark:bg-yellow-950/20";
    if (paymentResult.isSuccess) return "bg-green-50 dark:bg-green-950/20";
    return "bg-red-50 dark:bg-red-950/20";
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-black text-gray-900 dark:text-white">
      <Header />
      <main className="flex-1 container mx-auto py-8 px-4 flex items-center justify-center">
        <Card className={`max-w-2xl w-full border-2 ${getStatusColor()}`}>
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">{getStatusIcon()}</div>
            <CardTitle className="text-2xl font-bold">
              {!paymentResult?.isValid
                ? "Lỗi xác thực"
                : paymentResult.isSuccess
                ? "Thanh toán thành công! 🎉"
                : "Thanh toán không thành công"}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Status Message */}
            <Alert className={getStatusBg()}>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="font-medium">
                {paymentResult?.message || "Đang xử lý..."}
              </AlertDescription>
            </Alert>

            {/* Payment Details */}
            {paymentResult?.data && (
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Chi tiết giao dịch</h3>

                <div className="grid gap-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Số tiền:
                    </span>
                    <span className="font-bold text-lg text-green-600 dark:text-green-400">
                      {formatAmount(paymentResult.data.vnp_Amount)} VNĐ
                    </span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Mã đơn hàng:
                    </span>
                    <Badge variant="secondary" className="font-mono">
                      {paymentResult.data.vnp_TxnRef}
                    </Badge>
                  </div>

                  {paymentResult.data.vnp_TransactionNo && (
                    <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Mã giao dịch VNPay:
                      </span>
                      <Badge variant="outline" className="font-mono">
                        {paymentResult.data.vnp_TransactionNo}
                      </Badge>
                    </div>
                  )}

                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Ngân hàng:
                    </span>
                    <span className="font-medium">
                      {paymentResult.data.vnp_BankCode}
                    </span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Thời gian:
                    </span>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">
                        {formatDate(paymentResult.data.vnp_PayDate)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Success Message */}
                {paymentResult.isSuccess && (
                  <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="font-medium text-green-800 dark:text-green-200">
                        Đang tạo thiệp cưới của bạn...
                      </span>
                    </div>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      Bạn sẽ được chuyển đến thiệp cưới trong giây lát. Cảm ơn
                      bạn đã sử dụng dịch vụ!
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center pt-4">
              <Button
                variant="outline"
                onClick={() => router.back()}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Quay lại
              </Button>

              <Button
                onClick={() => router.push("/templates")}
                className="flex items-center gap-2"
              >
                <CreditCard className="h-4 w-4" />
                Xem thêm template
              </Button>

              <Button
                variant="ghost"
                onClick={() => router.push("/")}
                className="flex items-center gap-2"
              >
                <Home className="h-4 w-4" />
                Về trang chủ
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
