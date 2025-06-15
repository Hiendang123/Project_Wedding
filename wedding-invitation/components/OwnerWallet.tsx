"use client";

import { Badge } from "@/components/ui/badge";
import { Copy } from "lucide-react";
import { toast } from "sonner";

// Địa chỉ ví chủ - thay thế bằng địa chỉ thật của bạn
const OWNER_WALLET = "0x388DefF73DeA6ae08761051c9fa6EA7ac89D8a90";

export function OwnerWallet() {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(OWNER_WALLET);
    toast.success("Đã sao chép địa chỉ ví");
  };

  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-gray-500 dark:text-gray-400">
        Địa chỉ ví chủ:
      </span>
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="font-mono">
          {OWNER_WALLET.slice(0, 6)}...{OWNER_WALLET.slice(-4)}
        </Badge>
        <button
          onClick={copyToClipboard}
          className="p-1 hover:bg-accent rounded-md"
        >
          <Copy className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
