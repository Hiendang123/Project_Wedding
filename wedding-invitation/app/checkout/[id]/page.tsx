"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import axios from "axios";
import { API_ENDPOINTS } from "@/app/config/api";
import { Template } from "@/interface/Template";

// Wallet
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useSwitchChain, useSendTransaction } from "wagmi";
import { sepolia } from "wagmi/chains";
import { parseEther, Hash } from "viem";
import { OwnerWallet } from "@/components/OwnerWallet";
import { PaymentModal } from "@/components/PaymentModal";
import { WalletWrapper } from "@/components/WalletWrapper";

// 🏴‍☠️ Currency Converter - GenG Style
import { useAutoConvertTemplate } from "@/hooks/useCurrencyConverter";
import { CurrencyDisplay } from "@/components/CurrencyDisplay";

interface ChargeRes {
  hosted_url: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { id } = useParams() as { id: string };

  const [template, setTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState({
    isProcessing: false,
    isSuccess: false,
    error: null as string | null,
    transactionHash: undefined as string | undefined,
  });

  // wagmi hooks
  const { isConnected, chainId } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const { sendTransactionAsync } = useSendTransaction();

  // 🏴‍☠️ Currency converter hook - tự động convert khi có template price
  const currencyConverter = useAutoConvertTemplate(template?.priceAmount);

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const res = await axios.get<Template>(
          `${API_ENDPOINTS.templates}/${id}`
        );
        setTemplate(res.data);
      } catch (e) {
        setError("Không thể tải mẫu thiệp. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };
    fetchTemplate();
  }, [id]);

  const RECEIVER = "0x388DefF73DeA6ae08761051c9fa6EA7ac89D8a90";

  const handlePay = async () => {
    if (!template) return;
    if (!isConnected) {
      setError("Vui lòng kết nối ví trước.");
      return;
    }

    // 🚀 Kiểm tra có conversion result chưa
    if (!currencyConverter.conversionResult) {
      setError("Đang tính toán tỷ giá, vui lòng đợi...");
      return;
    }

    const ethAmount = currencyConverter.formatEthForTransaction(
      currencyConverter.conversionResult.ethAmount
    );

    try {
      // Set processing state first
      setPaymentStatus((prev) => ({
        ...prev,
        isProcessing: true,
        error: null,
      }));

      // ensure sepolia
      if (chainId !== sepolia.id) {
        await switchChainAsync({ chainId: sepolia.id });
      }

      const result = await sendTransactionAsync({
        to: RECEIVER as `0x${string}`,
        value: parseEther(ethAmount),
      });

      let txHash: string | undefined = undefined;
      if (typeof result === "object" && result !== null) {
        txHash = (result as any).hash || (result as any).transactionHash;
      } else if (typeof result === "string") {
        txHash = result;
      }

      // Update state with transaction result
      setPaymentStatus({
        isProcessing: false,
        isSuccess: true,
        error: null,
        transactionHash: txHash,
      });
    } catch (error: any) {
      console.error("Payment error:", error);
      setPaymentStatus({
        isProcessing: false,
        isSuccess: false,
        error: error.message || "Đã xảy ra lỗi khi thanh toán",
        transactionHash: undefined,
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !template) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-white dark:bg-black text-center">
        <p className="text-red-600 dark:text-red-400 text-lg font-medium max-w-md">
          {error || "Đã xảy ra lỗi."}
        </p>
        <Button onClick={() => router.back()}>Quay lại</Button>
      </div>
    );
  }

  // Log trạng thái truyền vào PaymentModal
  console.log("PaymentModal props:", paymentStatus);

  return (
    <WalletWrapper>
      <div className="min-h-screen flex flex-col bg-white dark:bg-black text-gray-900 dark:text-white">
        <Header />
        <main className="flex-1 container mx-auto py-8 px-4 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Preview */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Xem trước</h2>
            <div className="border rounded-lg overflow-hidden shadow dark:border-gray-700 min-h-[300px] flex items-center justify-center bg-gray-50 dark:bg-gray-800">
              {template.thumbnail ? (
                <Image
                  src={template.thumbnail}
                  alt={template.name}
                  width={800}
                  height={600}
                  className="w-full h-auto object-cover"
                />
              ) : (
                <span className="text-sm text-gray-400">
                  Không có ảnh xem trước
                </span>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <Card className="shadow-lg border-pink-200/60 dark:border-pink-800/40">
            <CardHeader>
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                Thanh toán
                <Badge
                  variant="outline"
                  className="bg-pink-50 text-pink-600 dark:bg-pink-900/20 dark:text-pink-300"
                >
                  Crypto
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <p className="text-lg font-medium">{template.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Mã: {template._id}
                </p>
              </div>

              <div className="border-t pt-4 flex items-center justify-between text-lg font-semibold">
                <span>Tổng:</span>
                <span className="text-pink-600 dark:text-pink-400">
                  {template.priceAmount.toLocaleString("vi-VN")} VNĐ
                </span>
              </div>

              {/* 🏴‍☠️ Currency Display - GenG Style */}
              <CurrencyDisplay
                conversionResult={currencyConverter.conversionResult}
                isLoading={currencyConverter.isLoading}
                error={currencyConverter.error}
                onRefresh={currencyConverter.refreshRates}
                className="my-4"
              />

              {/* Wallet connect + pay */}
              <ConnectButton chainStatus="icon" showBalance={false} />
              <OwnerWallet />

              <Button
                onClick={handlePay}
                disabled={
                  paymentStatus.isProcessing ||
                  !isConnected ||
                  !currencyConverter.conversionResult
                }
                className="w-full bg-pink-600 hover:bg-pink-700 text-white"
              >
                {paymentStatus.isProcessing ? (
                  <>
                    <Spinner size="sm" className="mr-2" /> Đang gửi...
                  </>
                ) : currencyConverter.conversionResult ? (
                  `Thanh toán ${currencyConverter.conversionResult.formattedEth} ETH`
                ) : (
                  <>
                    <Spinner size="sm" className="mr-2" /> Đang tính toán...
                  </>
                )}
              </Button>

              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                Bạn sẽ được chuyển tới Coinbase Commerce để hoàn tất thanh toán.
                Sau khi thanh toán thành công, thiệp sẽ được mở khóa trong tài
                khoản của bạn.
              </p>
            </CardContent>
          </Card>
        </main>
        <PaymentModal
          isProcessing={paymentStatus.isProcessing}
          isSuccess={paymentStatus.isSuccess}
          error={paymentStatus.error}
          transactionHash={paymentStatus.transactionHash}
          onClose={() =>
            setPaymentStatus({
              isProcessing: false,
              isSuccess: false,
              error: null,
              transactionHash: undefined,
            })
          }
        />
        <Footer />
      </div>
    </WalletWrapper>
  );
}
