import { NextRequest, NextResponse } from "next/server";
import { VNPayService } from "@/services/vnpay/vnpayService";

export async function POST(request: NextRequest) {
  try {
    // 🏴‍☠️ Get all VNPay parameters from the request - GenG style!
    const vnpParams = await request.json();

    console.log("🏴‍☠️ VNPay IPN received:", {
      vnp_TxnRef: vnpParams.vnp_TxnRef,
      vnp_ResponseCode: vnpParams.vnp_ResponseCode,
      vnp_TransactionStatus: vnpParams.vnp_TransactionStatus,
      vnp_Amount: vnpParams.vnp_Amount,
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

    if (!verificationResult.isValid) {
      console.error(
        "🚨 VNPay IPN verification failed:",
        verificationResult.message
      );
      return NextResponse.json({
        RspCode: "97",
        Message: "Invalid signature",
      });
    }

    if (verificationResult.isSuccess) {
      // 🎉 Payment successful - GenG approved!
      console.log("🎉 VNPay payment successful:", {
        orderId: vnpParams.vnp_TxnRef,
        transactionId: vnpParams.vnp_TransactionNo,
        amount: vnpParams.vnp_Amount,
        bankCode: vnpParams.vnp_BankCode,
      });

      // 🏴‍☠️ Here you can update your database, send notifications, etc.
      // For now, we'll just log the success

      return NextResponse.json({
        RspCode: "00",
        Message: "Confirm Success",
      });
    } else {
      // ❌ Payment failed
      console.log("❌ VNPay payment failed:", {
        orderId: vnpParams.vnp_TxnRef,
        responseCode: vnpParams.vnp_ResponseCode,
        message: verificationResult.message,
      });

      return NextResponse.json({
        RspCode: "00",
        Message: "Confirm Success",
      });
    }
  } catch (error: any) {
    console.error("🚨 VNPay IPN processing error:", error);

    return NextResponse.json({
      RspCode: "99",
      Message: "System error",
    });
  }
}

// 🎯 Handle GET requests too (some VNPay implementations use GET)
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const vnpParams: Record<string, string> = {};

    // 🏴‍☠️ Extract all VNPay parameters from URL - GenG style!
    for (const [key, value] of url.searchParams.entries()) {
      if (key.startsWith("vnp_")) {
        vnpParams[key] = value;
      }
    }

    console.log("🏴‍☠️ VNPay IPN GET received:", {
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

    if (!verificationResult.isValid) {
      console.error(
        "🚨 VNPay IPN GET verification failed:",
        verificationResult.message
      );
      return new Response("RspCode=97&Message=Invalid signature");
    }

    if (verificationResult.isSuccess) {
      console.log("🎉 VNPay GET payment successful:", vnpParams.vnp_TxnRef);
      return new Response("RspCode=00&Message=Confirm Success");
    } else {
      console.log("❌ VNPay GET payment failed:", vnpParams.vnp_TxnRef);
      return new Response("RspCode=00&Message=Confirm Success");
    }
  } catch (error: any) {
    console.error("🚨 VNPay IPN GET processing error:", error);
    return new Response("RspCode=99&Message=System error");
  }
}
