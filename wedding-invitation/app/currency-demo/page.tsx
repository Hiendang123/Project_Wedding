/**
 * 🏴‍☠️ Currency Converter Demo Page - GenG Style
 * Showcase tính năng chuyển đổi VND sang ETH
 * Perfect for testing và demo! ⚡
 */

"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calculator, Zap, TrendingUp } from "lucide-react";
import { useCurrencyConverter } from "@/hooks/useCurrencyConverter";
import { CurrencyDisplay } from "@/components/CurrencyDisplay";

export default function CurrencyDemoPage() {
  const [vndAmount, setVndAmount] = useState<string>("");
  const currencyConverter = useCurrencyConverter();

  const handleConvert = async () => {
    const amount = parseFloat(vndAmount);
    if (!amount || amount <= 0) {
      return;
    }
    await currencyConverter.convertAmount(amount);
  };

  const handlePresetAmount = (amount: number) => {
    setVndAmount(amount.toString());
    currencyConverter.convertAmount(amount);
  };

  const presetAmounts = [
    { label: "500K", value: 500000 },
    { label: "1 triệu", value: 1000000 },
    { label: "2 triệu", value: 2000000 },
    { label: "5 triệu", value: 5000000 },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-black text-gray-900 dark:text-white">
      <Header />

      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header Section */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2">
              <Calculator className="h-8 w-8 text-emerald-600" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                Currency Converter Demo
              </h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              🏴‍☠️ Trải nghiệm tính năng chuyển đổi VND sang ETH với tỷ giá thời
              gian thực! Hoàn hảo cho thanh toán thiệp cưới bằng crypto.
            </p>
            <div className="flex items-center justify-center gap-2">
              <Badge
                variant="outline"
                className="bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20"
              >
                <Zap className="h-3 w-3 mr-1" />
                Real-time rates
              </Badge>
              <Badge
                variant="outline"
                className="bg-blue-50 text-blue-600 dark:bg-blue-900/20"
              >
                <TrendingUp className="h-3 w-3 mr-1" />
                Auto-conversion
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <Card className="shadow-lg border-emerald-200/60 dark:border-emerald-800/40">
              <CardHeader>
                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                  💰 Nhập số tiền cần chuyển đổi
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="vnd-amount">Số tiền (VNĐ)</Label>
                  <Input
                    id="vnd-amount"
                    type="number"
                    placeholder="Nhập số tiền VNĐ..."
                    value={vndAmount}
                    onChange={(e) => setVndAmount(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        handleConvert();
                      }
                    }}
                    className="text-lg"
                  />
                </div>

                {/* Preset amounts */}
                <div className="space-y-2">
                  <Label>Hoặc chọn số tiền mẫu:</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {presetAmounts.map((preset) => (
                      <Button
                        key={preset.value}
                        variant="outline"
                        onClick={() => handlePresetAmount(preset.value)}
                        className="text-sm"
                      >
                        {preset.label}
                      </Button>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={handleConvert}
                  disabled={
                    !vndAmount ||
                    parseFloat(vndAmount) <= 0 ||
                    currencyConverter.isLoading
                  }
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                  size="lg"
                >
                  {currencyConverter.isLoading ? (
                    <>
                      <Calculator className="h-4 w-4 mr-2 animate-spin" />
                      Đang tính toán...
                    </>
                  ) : (
                    <>
                      <Calculator className="h-4 w-4 mr-2" />
                      Chuyển đổi ngay
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Result Section */}
            <CurrencyDisplay
              conversionResult={currencyConverter.conversionResult}
              isLoading={currencyConverter.isLoading}
              error={currencyConverter.error}
              onRefresh={currencyConverter.refreshRates}
              className="shadow-lg"
            />
          </div>

          {/* Features Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <Card className="border-emerald-200/60 dark:border-emerald-800/40">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg">
                    <Zap className="h-5 w-5 text-emerald-600" />
                  </div>
                  <h3 className="font-semibold">Tỷ giá thời gian thực</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Cập nhật tỷ giá VND/USD và giá ETH từ các API uy tín mỗi 5
                  phút.
                </p>
              </CardContent>
            </Card>

            <Card className="border-blue-200/60 dark:border-blue-800/40">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="font-semibold">Tự động chuyển đổi</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Tự động tính toán số ETH cần thanh toán dựa trên giá thiệp
                  VNĐ.
                </p>
              </CardContent>
            </Card>

            <Card className="border-purple-200/60 dark:border-purple-800/40">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                    <Calculator className="h-5 w-5 text-purple-600" />
                  </div>
                  <h3 className="font-semibold">Tính toán chính xác</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Định dạng ETH với 6 chữ số thập phân, phù hợp cho blockchain
                  transaction.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Usage Example */}
          <Card className="border-amber-200/60 dark:border-amber-800/40 bg-amber-50/50 dark:bg-amber-900/10">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-amber-800 dark:text-amber-200">
                💡 Cách sử dụng trong thanh toán thiệp cưới
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <span className="flex-shrink-0 w-6 h-6 bg-amber-200 dark:bg-amber-800 rounded-full flex items-center justify-center text-xs font-semibold">
                  1
                </span>
                <p>Khách hàng chọn template thiệp cưới với giá VNĐ</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="flex-shrink-0 w-6 h-6 bg-amber-200 dark:bg-amber-800 rounded-full flex items-center justify-center text-xs font-semibold">
                  2
                </span>
                <p>
                  Hệ thống tự động chuyển đổi giá VNĐ sang ETH theo tỷ giá thời
                  gian thực
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="flex-shrink-0 w-6 h-6 bg-amber-200 dark:bg-amber-800 rounded-full flex items-center justify-center text-xs font-semibold">
                  3
                </span>
                <p>
                  Khách hàng thanh toán bằng ETH với số tiền đã được tính toán
                  chính xác
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
