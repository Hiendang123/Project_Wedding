/**
 * 🏴‍☠️ CurrencyDisplay Component - GenG Style
 * Beautiful display for VND to ETH conversion
 * Real-time rates with smooth animations! ⚡
 */

"use client";

import { RefreshCw, TrendingUp, Clock, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { ConversionResult } from "@/services/currency/currencyConverter";

interface CurrencyDisplayProps {
  conversionResult: ConversionResult | null;
  isLoading: boolean;
  error: string | null;
  onRefresh?: () => void;
  showRefreshButton?: boolean;
  className?: string;
}

export function CurrencyDisplay({
  conversionResult,
  isLoading,
  error,
  onRefresh,
  showRefreshButton = true,
  className = "",
}: CurrencyDisplayProps) {
  if (error) {
    return (
      <Card className={`border-red-200 dark:border-red-800 ${className}`}>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
            <AlertCircle className="h-5 w-5" />
            <span className="text-sm">{error}</span>
          </div>
          {showRefreshButton && onRefresh && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              className="mt-3 w-full"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Thử lại
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className={`${className}`}>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Spinner size="sm" />
            <span className="text-sm">Đang tính toán tỷ giá...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!conversionResult) {
    return null;
  }

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(date);
  };

  return (
    <Card
      className={`border-emerald-200/60 dark:border-emerald-800/40 ${className}`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            💰 Chuyển đổi tiền tệ
            <Badge
              variant="outline"
              className="bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-300"
            >
              Real-time
            </Badge>
          </CardTitle>
          {showRefreshButton && onRefresh && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRefresh}
              disabled={isLoading}
              className="h-8 w-8 p-0"
            >
              <RefreshCw
                className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
              />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Main conversion display */}
        <div className="grid grid-cols-1 gap-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <span className="text-sm text-muted-foreground">Giá thiệp:</span>
            <span className="font-semibold text-lg">
              {conversionResult.formattedVnd} VNĐ
            </span>
          </div>

          <div className="flex items-center justify-center py-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              <span className="text-xs">Chuyển đổi</span>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
            <span className="text-sm text-emerald-700 dark:text-emerald-300">
              Thanh toán ETH:
            </span>
            <span className="font-bold text-xl text-emerald-600 dark:text-emerald-400">
              {conversionResult.formattedEth} ETH
            </span>
          </div>
        </div>

        {/* Conversion details */}
        <div className="pt-3 border-t space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">USD tương đương:</span>
            <span className="font-medium">
              ${conversionResult.formattedUsd}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Giá ETH hiện tại:</span>
            <span className="font-medium">
              $
              {conversionResult.ethPriceUsd.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Tỷ giá VND/USD:</span>
            <span className="font-medium">
              {(1 / conversionResult.vndToUsdRate).toLocaleString("vi-VN", {
                maximumFractionDigits: 0,
              })}
            </span>
          </div>
        </div>

        {/* Last update timestamp */}
        <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground pt-2 border-t">
          <Clock className="h-3 w-3" />
          <span>Cập nhật lúc: {formatTime(conversionResult.lastUpdate)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
