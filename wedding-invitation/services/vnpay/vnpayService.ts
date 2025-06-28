import crypto from "crypto";

export interface VNPayConfig {
  tmnCode: string;
  hashSecret: string;
  url: string;
  returnUrl: string;
  ipnUrl: string;
}

export interface CreatePaymentUrlParams {
  amount: number;
  orderDescription: string;
  orderId: string;
  ipAddr: string;
  bankCode?: string;
  locale?: "vn" | "en";
}

export interface VNPayReturnParams {
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
  vnp_SecureHash: string;
  [key: string]: string;
}

export class VNPayService {
  private config: VNPayConfig;

  constructor(config: VNPayConfig) {
    this.config = config;
  }

  /**
   * 🏴‍☠️ Create VNPay payment URL - GenG style!
   */
  createPaymentUrl(params: CreatePaymentUrlParams): string {
    const {
      amount,
      orderDescription,
      orderId,
      ipAddr,
      bankCode = "VNPAYQR",
      locale = "vn",
    } = params;

    // 🎯 Create payment parameters - GenG approved!
    const vnpParams: Record<string, string> = {
      vnp_Version: "2.1.0",
      vnp_Command: "pay",
      vnp_TmnCode: this.config.tmnCode,
      vnp_Amount: (amount * 100).toString(), // Convert to VNPay format (multiply by 100)
      vnp_CurrCode: "VND",
      vnp_TxnRef: orderId,
      vnp_OrderInfo: orderDescription,
      vnp_OrderType: "other",
      vnp_Locale: locale,
      vnp_ReturnUrl: this.config.returnUrl,
      vnp_IpAddr: ipAddr,
      vnp_CreateDate: this.getCurrentDateTime(),
    };

    // Add bank code if specified
    if (bankCode) {
      vnpParams.vnp_BankCode = bankCode;
    }

    // 🔒 Create secure hash - GenG style!
    const secureHash = this.createSecureHash(vnpParams);
    vnpParams.vnp_SecureHash = secureHash;

    // 🚀 Build URL with parameters
    const urlParams = new URLSearchParams(vnpParams);
    return `${this.config.url}?${urlParams.toString()}`;
  }

  /**
   * 🔍 Verify return URL from VNPay - GenG style!
   */
  verifyReturnUrl(params: VNPayReturnParams): {
    isValid: boolean;
    isSuccess: boolean;
    message: string;
    data?: VNPayReturnParams;
  } {
    try {
      const { vnp_SecureHash, ...otherParams } = params;

      // 🔒 Verify secure hash
      const calculatedHash = this.createSecureHash(otherParams);
      const isValidHash = calculatedHash === vnp_SecureHash;

      if (!isValidHash) {
        return {
          isValid: false,
          isSuccess: false,
          message: "Chữ ký không hợp lệ - Invalid signature",
        };
      }

      // ✅ Check payment status
      const isSuccess = params.vnp_ResponseCode === "00";
      const message = this.getResponseMessage(params.vnp_ResponseCode);

      return {
        isValid: true,
        isSuccess,
        message,
        data: params,
      };
    } catch (error) {
      return {
        isValid: false,
        isSuccess: false,
        message: "Lỗi xác thực dữ liệu - Data verification error",
      };
    }
  }

  /**
   * 🔐 Create secure hash for VNPay - GenG style!
   */
  private createSecureHash(params: Record<string, string>): string {
    // Remove vnp_SecureHash if exists
    const { vnp_SecureHash, ...cleanParams } = params;

    // Sort parameters alphabetically
    const sortedKeys = Object.keys(cleanParams).sort();

    // Create query string
    const queryString = sortedKeys
      .map((key) => `${key}=${cleanParams[key]}`)
      .join("&");

    // Create HMAC SHA512 hash
    const hmac = crypto.createHmac("sha512", this.config.hashSecret);
    hmac.update(queryString, "utf8");
    return hmac.digest("hex");
  }

  /**
   * 📅 Get current date time in VNPay format - GenG style!
   */
  private getCurrentDateTime(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    const day = now.getDate().toString().padStart(2, "0");
    const hour = now.getHours().toString().padStart(2, "0");
    const minute = now.getMinutes().toString().padStart(2, "0");
    const second = now.getSeconds().toString().padStart(2, "0");

    return `${year}${month}${day}${hour}${minute}${second}`;
  }

  /**
   * 💬 Get response message from VNPay response code - GenG style!
   */
  private getResponseMessage(responseCode: string): string {
    const messages: Record<string, string> = {
      "00": "Giao dịch thành công",
      "07": "Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường).",
      "09": "Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng chưa đăng ký dịch vụ InternetBanking tại ngân hàng.",
      "10": "Giao dịch không thành công do: Khách hàng xác thực thông tin thẻ/tài khoản không đúng quá 3 lần",
      "11": "Giao dịch không thành công do: Đã hết hạn chờ thanh toán. Xin quý khách vui lòng thực hiện lại giao dịch.",
      "12": "Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng bị khóa.",
      "13": "Giao dịch không thành công do Quý khách nhập sai mật khẩu xác thực giao dịch (OTP). Xin quý khách vui lòng thực hiện lại giao dịch.",
      "24": "Giao dịch không thành công do: Khách hàng hủy giao dịch",
      "51": "Giao dịch không thành công do: Tài khoản của quý khách không đủ số dư để thực hiện giao dịch.",
      "65": "Giao dịch không thành công do: Tài khoản của Quý khách đã vượt quá hạn mức giao dịch trong ngày.",
      "75": "Ngân hàng thanh toán đang bảo trì.",
      "79": "Giao dịch không thành công do: KH nhập sai mật khẩu thanh toán quá số lần quy định. Xin quý khách vui lòng thực hiện lại giao dịch",
      "99": "Các lỗi khác (lỗi còn lại, không có trong danh sách mã lỗi đã liệt kê)",
    };

    return messages[responseCode] || `Mã lỗi không xác định: ${responseCode}`;
  }

  /**
   * 🎯 Get bank codes for VNPay - GenG style!
   */
  static getBankCodes(): Record<string, string> {
    return {
      VNPAYQR: "Thanh toán quét mã QR",
      VNBANK: "Thẻ ATM - Tài khoản ngân hàng nội địa",
      INTCARD: "Thẻ thanh toán quốc tế",
      VISA: "Thẻ VISA",
      MASTERCARD: "Thẻ MASTERCARD",
      JCB: "Thẻ JCB",
      VCB: "Ngân hàng TMCP Ngoại Thương Việt Nam",
      TCB: "Ngân hàng TMCP Kỹ Thương Việt Nam",
      MB: "Ngân hàng TMCP Quân Đội",
      VIB: "Ngân hàng TMCP Quốc Tế Việt Nam",
      ICB: "Ngân hàng TMCP Công Thương Việt Nam",
      EXB: "Ngân hàng TMCP Xuất Nhập Khẩu Việt Nam",
      ACB: "Ngân hàng TMCP Á Châu",
      HDB: "Ngân hàng TMCP Phát Triển Thành phố Hồ Chí Minh",
      MSB: "Ngân hàng TMCP Hàng Hải",
      NVB: "Ngân hàng TMCP Nam Việt",
      VAB: "Ngân hàng TMCP Việt Á",
      VPB: "Ngân hàng TMCP Việt Nam Thịnh Vượng",
      SCB: "Ngân hàng TMCP Sài Gòn",
      BIDV: "Ngân hàng TMCP Đầu tư và Phát triển Việt Nam",
    };
  }
}
