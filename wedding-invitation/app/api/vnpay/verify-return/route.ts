import { NextRequest, NextResponse } from "next/server";
import { VNPayService } from "@/services/vnpay/vnpayService";

export async function POST(request: NextRequest) {
  try {
    const vnpParams = await request.json();

    console.log("🏴‍☠️ VNPay verify return request:", {
      vnp_TxnRef: vnpParams.vnp_TxnRef,
      vnp_ResponseCode: vnpParams.vnp_ResponseCode,
      vnp_TransactionStatus: vnpParams.vnp_TransactionStatus,
    });

    // 🔧 Initialize VNPay service
    const vnpayService = new VNPayService({
      tmnCode: process.env.VNPAY_TMN_CODE || "T17OP5G7",
      hashSecret:
        process.env.VNPAY_HASH_SECRET || "BW2T54LURCEEC9CA7XGEXRTXE1RHEJQZ",
      url:
        process.env.VNPAY_URL ||
        "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
      returnUrl: `${
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
      }/vnpay/return`,
      ipnUrl: `${
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
      }/api/vnpay/ipn`,
    });

    // 🔍 Verify the payment result
    const verificationResult = vnpayService.verifyReturnUrl(vnpParams);

    console.log("🏴‍☠️ VNPay verification result:", {
      isValid: verificationResult.isValid,
      isSuccess: verificationResult.isSuccess,
      message: verificationResult.message,
      orderId: vnpParams.vnp_TxnRef,
    });

    return NextResponse.json(verificationResult);
  } catch (error: any) {
    console.error("🚨 VNPay verify return error:", error);

    return NextResponse.json(
      {
        isValid: false,
        isSuccess: false,
        message: "Lỗi xác thực dữ liệu thanh toán",
      },
      { status: 500 }
    );
  }
}
