"use client";

import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle } from "lucide-react";
import { useAccount, useSwitchChain, useSendTransaction } from "wagmi";
import { sepolia } from "wagmi/chains";
import { parseEther } from "viem";
import { OwnerWallet } from "@/components/OwnerWallet";
import Swal from "sweetalert2";
import { getTransactionReceipt } from "@wagmi/core";
import { config } from "@/app/config/wagmi";

interface PaymentModalProps {
  isProcessing: boolean;
  isSuccess: boolean;
  error: string | null;
  transactionHash?: string;
  onClose: () => void;
}

export function PaymentModal({
  isProcessing,
  isSuccess,
  error,
  transactionHash,
  onClose,
}: PaymentModalProps) {
  const { address, isConnected } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const { sendTransactionAsync } = useSendTransaction();
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [checking, setChecking] = useState(false);
  const [hasShownPopup, setHasShownPopup] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Set visibility based on props
  useEffect(() => {
    if (isProcessing || isSuccess || error || checking) {
      setIsVisible(true);
    }
  }, [isProcessing, isSuccess, error, checking]);

  // Reset state khi bắt đầu giao dịch mới
  useEffect(() => {
    if (isProcessing) {
      setIsConfirmed(false);
      setHasShownPopup(false);
    }
  }, [isProcessing]);

  // Kiểm tra trạng thái giao dịch khi có transactionHash
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;

    async function checkReceipt() {
      if (!transactionHash) return;

      try {
        const receipt = await getTransactionReceipt(config, {
          hash: transactionHash as `0x${string}`,
        });

        if (receipt && receipt.status === "success") {
          setIsConfirmed(true);
          setChecking(false);
          if (interval) clearInterval(interval);
        }
      } catch (e) {
        // Không làm gì, tiếp tục polling
      }
    }

    if (transactionHash && !isConfirmed) {
      setChecking(true);
      checkReceipt(); // Kiểm tra ngay
      interval = setInterval(checkReceipt, 3000); // Poll mỗi 3s
    }

    if (isConfirmed && interval) {
      clearInterval(interval);
      setChecking(false);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [transactionHash, isConfirmed]);

  // SweetAlert2 chỉ hiện đúng 1 lần khi xác nhận, sau đó tự động đóng modal
  useEffect(() => {
    if (isConfirmed && !hasShownPopup) {
      setHasShownPopup(true);
      Swal.fire({
        title: "Thanh toán thành công!",
        text: "Giao dịch của bạn đã được xác nhận trên blockchain.",
        icon: "success",
        confirmButtonText: "Xem giao dịch",
        showCancelButton: true,
        cancelButtonText: "Đi đến trang chủ",
      }).then((result) => {
        if (
          result.isConfirmed &&
          transactionHash &&
          typeof window !== "undefined"
        ) {
          window.open(
            `https://sepolia.etherscan.io/tx/${transactionHash}`,
            "_blank"
          );
        }
        // Đóng modal và reset state sau khi hiện popup
        onClose();
        setIsVisible(false);
        // Chuyển hướng đến trang chủ
        if (typeof window !== "undefined") {
          window.location.href = "/";
        }
      });
    }
  }, [isConfirmed, hasShownPopup, transactionHash, onClose]);

  useEffect(() => {
    if (error) {
      Swal.fire({
        title: "Thanh toán thất bại",
        text: error,
        icon: "error",
        confirmButtonText: "Thử lại",
        showCancelButton: true,
        cancelButtonText: "Đóng",
      }).then((result) => {
        if (!result.isConfirmed) {
          onClose();
          setIsVisible(false);
        }
      });
    }
  }, [error, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md p-6 bg-white dark:bg-gray-900">
        <div className="flex flex-col items-center space-y-4">
          {(isProcessing || checking) && (
            <>
              <Spinner size="lg" />
              <h3 className="text-lg font-semibold">
                {isProcessing
                  ? "Đang xử lý thanh toán..."
                  : "Đang chờ xác nhận giao dịch..."}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                Vui lòng không đóng cửa sổ này cho đến khi giao dịch hoàn tất
              </p>
              {transactionHash && (
                <p className="text-xs text-gray-400">
                  Hash: {transactionHash.slice(0, 10)}...
                  {transactionHash.slice(-8)}
                </p>
              )}
            </>
          )}

          {isConfirmed && !checking && (
            <>
              <CheckCircle2 className="h-12 w-12 text-green-500" />
              <h3 className="text-lg font-semibold">Thanh toán thành công!</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                Giao dịch của bạn đã được xác nhận trên blockchain
              </p>
              {transactionHash && (
                <Button
                  variant="outline"
                  onClick={() => {
                    if (typeof window !== "undefined") {
                      window.open(
                        `https://sepolia.etherscan.io/tx/${transactionHash}`,
                        "_blank"
                      );
                    }
                  }}
                >
                  Xem giao dịch
                </Button>
              )}
            </>
          )}

          {error && !isProcessing && !checking && (
            <>
              <XCircle className="h-12 w-12 text-red-500" />
              <h3 className="text-lg font-semibold">Thanh toán thất bại</h3>
              <p className="text-sm text-red-500 dark:text-red-400 text-center">
                {error}
              </p>
              <Button variant="outline" onClick={onClose}>
                Thử lại
              </Button>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}
