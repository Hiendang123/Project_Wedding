"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import { Coins, CheckCircle, AlertCircle, Wallet } from "lucide-react";
import { Template } from "@/interface/Template";

// Wallet imports - safe to use here as this is client-only
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useSwitchChain, useSendTransaction } from "wagmi";
import { sepolia } from "wagmi/chains";
import { parseEther } from "viem";

// Currency converter
import { useAutoConvertTemplate } from "@/hooks/useCurrencyConverter";
import { CurrencyDisplay } from "@/components/CurrencyDisplay";
import { OwnerWallet } from "@/components/OwnerWallet";

interface CryptoPaymentClientProps {
  template: Template;
  onSuccess: (transactionHash: string) => void;
  onError: (error: string) => void;
  className?: string;
}

export function CryptoPaymentClient({
  template,
  onSuccess,
  onError,
  className = "",
}: CryptoPaymentClientProps) {
  const [paymentStatus, setPaymentStatus] = useState({
    isProcessing: false,
    isSuccess: false,
    error: null as string | null,
    transactionHash: undefined as string | undefined,
  });

  // 🏴‍☠️ wagmi hooks - safe to use here as this is client-only - GenG style!
  const { isConnected, chainId } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const { sendTransactionAsync } = useSendTransaction();

  // 🏴‍☠️ Currency converter hook
  const currencyConverter = useAutoConvertTemplate(template?.priceAmount);

  // Receiver wallet address
  const RECEIVER = "0x388DefF73DeA6ae08761051c9fa6EA7ac89D8a90";

  const handlePay = async () => {
    if (!template) return;
    if (!isConnected) {
      onError("Vui lòng kết nối ví trước.");
      return;
    }

    if (!currencyConverter.conversionResult) {
      onError("Đang tính toán tỷ giá, vui lòng đợi...");
      return;
    }

    const ethAmount = currencyConverter.formatEthForTransaction(
      currencyConverter.conversionResult.ethAmount
    );

    try {
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

      setPaymentStatus({
        isProcessing: false,
        isSuccess: true,
        error: null,
        transactionHash: txHash,
      });

      if (txHash) {
        onSuccess(txHash);
      }
    } catch (error: any) {
      console.error("Payment error:", error);
      const errorMessage = error.message || "Đã xảy ra lỗi khi thanh toán";
      setPaymentStatus({
        isProcessing: false,
        isSuccess: false,
        error: errorMessage,
        transactionHash: undefined,
      });
      onError(errorMessage);
    }
  };

  if (paymentStatus.isSuccess && paymentStatus.transactionHash) {
    return (
      <Card className={`${className} border-green-200 dark:border-green-800`}>
        <CardContent className="text-center space-y-4 p-6">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
          <h3 className="text-xl font-semibold text-green-700 dark:text-green-400">
            Thanh toán thành công! 🎉
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Giao dịch đã được xác nhận trên blockchain
          </p>
          <div className="bg-green-50 dark:bg-green-950/20 p-3 rounded-lg">
            <p className="text-xs text-green-600 dark:text-green-400 break-all">
              TX: {paymentStatus.transactionHash}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`${className} border-orange-200 dark:border-orange-800`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-700 dark:text-orange-300">
          <Coins className="h-5 w-5" />
          Thanh toán bằng Ethereum
          <Badge
            variant="outline"
            className="bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-300"
          >
            Sepolia
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="bg-orange-50 dark:bg-orange-950/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">Giá gốc:</span>
              <span className="text-lg font-bold text-orange-600 dark:text-orange-400">
                {template.priceAmount.toLocaleString("vi-VN")} VNĐ
              </span>
            </div>
          </div>

          <CurrencyDisplay
            conversionResult={currencyConverter.conversionResult}
            isLoading={currencyConverter.isLoading}
            error={currencyConverter.error}
            onRefresh={currencyConverter.refreshRates}
            className="my-4"
          />

          {paymentStatus.error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{paymentStatus.error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Wallet className="h-4 w-4 text-orange-600" />
              <span className="text-sm font-medium">Kết nối ví của bạn:</span>
            </div>
            <ConnectButton chainStatus="icon" showBalance={false} />
            <OwnerWallet />
          </div>

          <Button
            onClick={handlePay}
            disabled={
              paymentStatus.isProcessing ||
              !isConnected ||
              !currencyConverter.conversionResult
            }
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-3"
          >
            {paymentStatus.isProcessing ? (
              <>
                <Spinner size="sm" className="mr-2" /> Đang gửi giao dịch...
              </>
            ) : currencyConverter.conversionResult ? (
              <>
                <Coins className="mr-2 h-4 w-4" />
                Thanh toán {currencyConverter.conversionResult.formattedEth} ETH
              </>
            ) : (
              <>
                <Spinner size="sm" className="mr-2" /> Đang tính toán tỷ giá...
              </>
            )}
          </Button>

          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
            <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
              🏴‍☠️ Thanh toán phi tập trung trên Sepolia testnet. Giao dịch sẽ
              được xác nhận trong vài phút.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
