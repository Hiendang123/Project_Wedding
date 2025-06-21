/**
 * 🏴‍☠️ Currency Routes - GenG Style
 * Backend API cho currency conversion
 * Backup cho client-side service! ⚡
 */

const express = require("express");
const router = express.Router();

// Currency conversion controller
const currencyController = {
  /**
   * 🚀 Convert VND to ETH
   * GET /api/currency/convert?vnd=2000000
   */
  convertVndToEth: async (req, res) => {
    try {
      const { vnd } = req.query;

      if (!vnd || isNaN(vnd) || parseFloat(vnd) <= 0) {
        return res.status(400).json({
          success: false,
          message: "Số tiền VND không hợp lệ",
        });
      }

      const vndAmount = parseFloat(vnd);

      // Fetch VND to USD rate
      const usdResponse = await fetch(
        "https://api.exchangerate-api.com/v4/latest/USD"
      );
      if (!usdResponse.ok) {
        throw new Error("Failed to fetch USD rates");
      }
      const usdData = await usdResponse.json();
      const vndToUsdRate = 1 / usdData.rates.VND;

      // Fetch ETH price
      const ethResponse = await fetch(
        "https://api.coincap.io/v2/assets/ethereum"
      );
      if (!ethResponse.ok) {
        throw new Error("Failed to fetch ETH price");
      }
      const ethData = await ethResponse.json();
      const ethPriceUsd = parseFloat(ethData.data.priceUsd);

      // Calculate conversion
      const usdAmount = vndAmount * vndToUsdRate;
      const ethAmount = usdAmount / ethPriceUsd;

      const result = {
        vndAmount,
        usdAmount,
        ethAmount,
        ethPriceUsd,
        vndToUsdRate,
        lastUpdate: new Date(),
        formattedEth: ethAmount.toFixed(6),
        formattedVnd: vndAmount.toLocaleString("vi-VN"),
        formattedUsd: usdAmount.toFixed(2),
      };

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error("🚨 Currency conversion error:", error);
      res.status(500).json({
        success: false,
        message: "Lỗi chuyển đổi tiền tệ",
        error: error.message,
      });
    }
  },

  /**
   * 📊 Get current exchange rates
   * GET /api/currency/rates
   */
  getCurrentRates: async (req, res) => {
    try {
      // Fetch rates in parallel
      const [usdResponse, ethResponse] = await Promise.all([
        fetch("https://api.exchangerate-api.com/v4/latest/USD"),
        fetch("https://api.coincap.io/v2/assets/ethereum"),
      ]);

      if (!usdResponse.ok || !ethResponse.ok) {
        throw new Error("Failed to fetch exchange rates");
      }

      const [usdData, ethData] = await Promise.all([
        usdResponse.json(),
        ethResponse.json(),
      ]);

      const rates = {
        vndToUsd: 1 / usdData.rates.VND,
        ethPriceUsd: parseFloat(ethData.data.priceUsd),
        lastUpdate: new Date(),
        vndPerUsd: usdData.rates.VND,
        ethChange24h: parseFloat(ethData.data.changePercent24Hr),
      };

      res.json({
        success: true,
        data: rates,
      });
    } catch (error) {
      console.error("🚨 Rates fetch error:", error);
      res.status(500).json({
        success: false,
        message: "Lỗi lấy tỷ giá",
        error: error.message,
      });
    }
  },
};

// Routes
router.get("/convert", currencyController.convertVndToEth);
router.get("/rates", currencyController.getCurrentRates);

module.exports = router;
