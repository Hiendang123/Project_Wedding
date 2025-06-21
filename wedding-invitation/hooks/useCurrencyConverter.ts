/**
 * 🏴‍☠️ useCurrencyConverter Hook - GenG Style
 * React hook để sử dụng currency converter service
 * Auto-convert VND to ETH with real-time rates! ⚡
 */

import { useState, useEffect, useCallback } from "react";
import {
  currencyConverter,
  ConversionResult,
} from "@/services/currency/currencyConverter";

interface UseCurrencyConverterState {
  conversionResult: ConversionResult | null;
  isLoading: boolean;
  error: string | null;
  isRatesLoaded: boolean;
}

interface UseCurrencyConverterReturn extends UseCurrencyConverterState {
  convertAmount: (vndAmount: number) => Promise<void>;
  refreshRates: () => Promise<void>;
  formatEthForTransaction: (ethAmount: number) => string;
}

export function useCurrencyConverter(): UseCurrencyConverterReturn {
  const [state, setState] = useState<UseCurrencyConverterState>({
    conversionResult: null,
    isLoading: false,
    error: null,
    isRatesLoaded: false,
  });

  /**
   * 🚀 Convert VND amount to ETH
   */
  const convertAmount = useCallback(async (vndAmount: number) => {
    if (!vndAmount || vndAmount <= 0) {
      setState((prev) => ({
        ...prev,
        error: "Số tiền phải lớn hơn 0",
        conversionResult: null,
      }));
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const result = await currencyConverter.convertVndToEth(vndAmount);
      setState((prev) => ({
        ...prev,
        conversionResult: result,
        isLoading: false,
        isRatesLoaded: true,
        error: null,
      }));
    } catch (error) {
      console.error("🚨 Currency conversion error:", error);
      setState((prev) => ({
        ...prev,
        error:
          error instanceof Error ? error.message : "Lỗi chuyển đổi tiền tệ",
        isLoading: false,
        conversionResult: null,
      }));
    }
  }, []);

  /**
   * 🔄 Refresh exchange rates manually
   */
  const refreshRates = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      await currencyConverter.getCurrentRates();
      setState((prev) => ({
        ...prev,
        isLoading: false,
        isRatesLoaded: true,
        error: null,
      }));
    } catch (error) {
      console.error("🚨 Failed to refresh rates:", error);
      setState((prev) => ({
        ...prev,
        error: "Không thể cập nhật tỷ giá",
        isLoading: false,
      }));
    }
  }, []);

  /**
   * 🎯 Format ETH for blockchain transaction
   */
  const formatEthForTransaction = useCallback((ethAmount: number): string => {
    return currencyConverter.formatEthForTransaction(ethAmount);
  }, []);

  // Auto-load rates on mount
  useEffect(() => {
    refreshRates();
  }, [refreshRates]);

  return {
    ...state,
    convertAmount,
    refreshRates,
    formatEthForTransaction,
  };
}

/**
 * 💡 Hook for automatic conversion based on template price
 * Tự động convert khi có template price
 */
export function useAutoConvertTemplate(templatePriceAmount?: number) {
  const converter = useCurrencyConverter();

  useEffect(() => {
    if (templatePriceAmount && templatePriceAmount > 0) {
      converter.convertAmount(templatePriceAmount);
    }
  }, [templatePriceAmount, converter.convertAmount]);

  return converter;
}
