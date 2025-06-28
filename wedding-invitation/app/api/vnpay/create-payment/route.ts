import { NextRequest, NextResponse } from "next/server";
import { VNPayService } from "@/services/vnpay/vnpayService";

export async function POST(request: NextRequest) {
  try {
    const {
      amount,
      orderInfo,
      orderId,
      bankCode = "VNPAYQR",
    } = await request.json();

    // 🎯 Validate required fields - GenG style!
    if (!amount || !orderInfo || !orderId) {
      return NextResponse.json(
        { error: "Thiếu thông tin bắt buộc: amount, orderInfo, orderId" },
        { status: 400 }
      );
    }

    // 🏴‍☠️ Get client IP address - GenG approved!
    const forwardedFor = request.headers.get("x-forwarded-for");
    const realIp = request.headers.get("x-real-ip");
    const ipAddr = forwardedFor?.split(",")[0] || realIp || "127.0.0.1";

    // 🔧 Initialize VNPay service with environment variables
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

    // 🚀 Create payment URL
    const paymentUrl = vnpayService.createPaymentUrl({
      amount: Number(amount),
      orderDescription: orderInfo,
      orderId: orderId,
      ipAddr: ipAddr,
      bankCode: bankCode,
      locale: "vn",
    });

    console.log("🏴‍☠️ VNPay payment URL created:", {
      orderId,
      amount,
      bankCode,
      ipAddr,
      paymentUrl: paymentUrl.substring(0, 100) + "...",
    });

    return NextResponse.json({
      success: true,
      paymentUrl,
      orderId,
      amount,
    });
  } catch (error: any) {
    console.error("🚨 VNPay create payment error:", error);

    return NextResponse.json(
      {
        error: "Không thể tạo liên kết thanh toán VNPay",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
