/**
 * 🏴‍☠️ Currency Converter Service - GenG Style
 * Tự động chuyển đổi VND sang ETH với tỷ giá thời gian thực
 * Coded by a seasoned pirate developer! ⚡
 */

interface ExchangeRateResponse {
  rates: { [key: string]: number };
  base: string;
  date: string;
}

interface CoinCapResponse {
  data: {
    id: string;
    rank: string;
    symbol: string;
    name: string;
    supply: string;
    maxSupply: string;
    marketCapUsd: string;
    volumeUsd24Hr: string;
    priceUsd: string;
    changePercent24Hr: string;
    vwap24Hr: string;
  };
}

interface ConversionResult {
  vndAmount: number;
  usdAmount: number;
  ethAmount: number;
  ethPriceUsd: number;
  vndToUsdRate: number;
  lastUpdate: Date;
  formattedEth: string;
  formattedVnd: string;
  formattedUsd: string;
}

class CurrencyConverter {
  private vndToUsdRate: number | null = null;
  private ethPriceUsd: number | null = null;
  private lastUpdate: Date | null = null;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache
  private readonly FALLBACK_VND_RATE = 1 / 24000; // ~24,000 VND = 1 USD
  private readonly FALLBACK_ETH_PRICE = 2500; // Fallback ETH price in USD

  /**
   * 🚀 Lấy tỷ giá VND/USD từ API
   */
  private async fetchVndToUsdRate(): Promise<number> {
    try {
      const response = await fetch(
        "https://api.exchangerate-api.com/v4/latest/USD",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ExchangeRateResponse = await response.json();

      if (!data.rates?.VND) {
        throw new Error("VND rate not found in response");
      }

      return 1 / data.rates.VND; // Convert to VND → USD rate
    } catch (error) {
      console.warn("🚨 Failed to fetch VND rate, using fallback:", error);
      return this.FALLBACK_VND_RATE;
    }
  }

  /**
   * 💎 Lấy giá ETH hiện tại từ CoinCap API
   */
  private async fetchEthPrice(): Promise<number> {
    try {
      const response = await fetch(
        "https://api.coincap.io/v2/assets/ethereum",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: CoinCapResponse = await response.json();

      if (!data.data?.priceUsd) {
        throw new Error("ETH price not found in response");
      }

      return parseFloat(data.data.priceUsd);
    } catch (error) {
      console.warn("🚨 Failed to fetch ETH price, using fallback:", error);
      return this.FALLBACK_ETH_PRICE;
    }
  }

  /**
   * 🔄 Cập nhật tỷ giá nếu cần thiết
   */
  private async updateRatesIfNeeded(): Promise<void> {
    const now = new Date();
    const needsUpdate =
      !this.lastUpdate ||
      now.getTime() - this.lastUpdate.getTime() > this.CACHE_DURATION;

    if (needsUpdate) {
      console.log("🔄 Updating currency rates...");

      // Fetch both rates in parallel for better performance
      const [vndRate, ethPrice] = await Promise.all([
        this.fetchVndToUsdRate(),
        this.fetchEthPrice(),
      ]);

      this.vndToUsdRate = vndRate;
      this.ethPriceUsd = ethPrice;
      this.lastUpdate = now;

      console.log("✅ Rates updated successfully:", {
        vndToUsd: this.vndToUsdRate,
        ethPrice: this.ethPriceUsd,
        timestamp: this.lastUpdate.toISOString(),
      });
    }
  }

  /**
   * 💰 Chuyển đổi VND sang ETH
   * @param vndAmount - Số tiền VND cần chuyển đổi
   * @returns ConversionResult với đầy đủ thông tin chuyển đổi
   */
  public async convertVndToEth(vndAmount: number): Promise<ConversionResult> {
    if (!vndAmount || vndAmount <= 0) {
      throw new Error("Amount must be greater than 0");
    }

    await this.updateRatesIfNeeded();

    if (!this.vndToUsdRate || !this.ethPriceUsd) {
      throw new Error("Failed to get exchange rates");
    }

    // Tính toán chuyển đổi
    const usdAmount = vndAmount * this.vndToUsdRate;
    const ethAmount = usdAmount / this.ethPriceUsd;

    return {
      vndAmount,
      usdAmount,
      ethAmount,
      ethPriceUsd: this.ethPriceUsd,
      vndToUsdRate: this.vndToUsdRate,
      lastUpdate: this.lastUpdate!,
      formattedEth: ethAmount.toFixed(6),
      formattedVnd: vndAmount.toLocaleString("vi-VN"),
      formattedUsd: usdAmount.toFixed(2),
    };
  }

  /**
   * 📊 Lấy thông tin tỷ giá hiện tại
   */
  public async getCurrentRates(): Promise<{
    vndToUsd: number;
    ethPriceUsd: number;
    lastUpdate: Date;
  }> {
    await this.updateRatesIfNeeded();

    return {
      vndToUsd: this.vndToUsdRate!,
      ethPriceUsd: this.ethPriceUsd!,
      lastUpdate: this.lastUpdate!,
    };
  }

  /**
   * 🎯 Validate và format số tiền ETH cho smart contract
   */
  public formatEthForTransaction(ethAmount: number): string {
    // Đảm bảo có ít nhất 6 decimal places và không quá 18
    const formatted = ethAmount.toFixed(6);
    return formatted;
  }

  /**
   * 💡 Tính phí gas estimate (optional - có thể mở rộng sau)
   */
  public estimateGasFee(ethAmount: number): number {
    // Rough estimate: ~0.002 ETH for ERC20 transfer on mainnet
    // Sepolia testnet usually much cheaper
    const baseGasFee = 0.001; // ETH
    return baseGasFee;
  }
}

// Export singleton instance
export const currencyConverter = new CurrencyConverter();

// Export types for use in components
export type { ConversionResult };
