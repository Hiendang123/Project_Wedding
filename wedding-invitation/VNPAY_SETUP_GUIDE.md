# 🏴‍☠️ VNPay Integration Guide - GenG Style!

## 🎯 Tổng quan

VNPay là cổng thanh toán phổ biến nhất Việt Nam, hỗ trợ:

- **VNPay QR**: Quét mã QR thanh toán
- **Internet Banking**: Các ngân hàng lớn VN
- **ATM Cards**: Thẻ ATM nội địa
- **International Cards**: Visa, Mastercard, JCB

## 🚀 Cài đặt nhanh

### 1. Đăng ký tài khoản Sandbox

```bash
# Truy cập: https://sandbox.vnpayment.vn/devreg/
# Điền thông tin và nhận:
# - vnp_TmnCode (Mã merchant)
# - vnp_HashSecret (Khóa bí mật)
```

### 2. Cấu hình Environment Variables

```bash
# Thêm vào file .env.local
VNPAY_TMN_CODE=DEMOV210
VNPAY_HASH_SECRET=your_hash_secret_here
VNPAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 3. Test với thẻ Demo

```bash
# Thẻ ATM NCB (Thành công)
Số thẻ: 9704198526191432198
Tên: NGUYEN VAN A
Ngày phát hành: 07/15
OTP: 123456

# Thẻ Visa (Thành công)
Số thẻ: 4456530000001005
CVV: 123
Tên: NGUYEN VAN A
Ngày hết hạn: 12/26
```

## 🏗️ Kiến trúc hệ thống

```
┌─────────────────┐    ┌──────────────┐    ┌─────────────┐
│   User Browser  │───▶│ Your Website │───▶│   VNPay     │
│                 │    │              │    │   Gateway   │
└─────────────────┘    └──────────────┘    └─────────────┘
         ▲                       ▲                  │
         │                       │                  │
         │        Return URL     │    IPN URL       │
         └───────────────────────┼──────────────────┘
                                 │
                        ┌──────────────┐
                        │   Database   │
                        │   Update     │
                        └──────────────┘
```

## 📁 Cấu trúc Files đã tạo

```
wedding-invitation/
├── services/vnpay/
│   └── vnpayService.ts          # Core VNPay service
├── components/
│   ├── PaymentMethodSelector.tsx # Updated with VNPay toggle
│   └── VNPayPayment.tsx         # VNPay payment component
├── app/
│   ├── api/vnpay/
│   │   ├── create-payment/route.ts    # Tạo URL thanh toán
│   │   ├── verify-return/route.ts     # Xác thực kết quả
│   │   └── ipn/route.ts              # Webhook từ VNPay
│   ├── vnpay/return/
│   │   └── page.tsx             # Trang kết quả thanh toán
│   └── checkout/[id]/
│       └── page.tsx             # Updated checkout page
└── VNPAY_SETUP_GUIDE.md         # File này
```

## 🔧 API Endpoints

### 1. Create Payment URL

```typescript
POST /api/vnpay/create-payment
{
  "amount": 100000,
  "orderInfo": "Thanh toan template wedding",
  "orderId": "ORDER_123456789",
  "bankCode": "VNPAYQR"
}

Response:
{
  "success": true,
  "paymentUrl": "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?...",
  "orderId": "ORDER_123456789",
  "amount": 100000
}
```

### 2. IPN Webhook (VNPay → Your Server)

```typescript
POST /api/vnpay/ipn
# VNPay sẽ gửi thông tin giao dịch đến endpoint này
# Dùng để cập nhật database, gửi email, etc.
```

### 3. Return URL Verification

```typescript
POST /api/vnpay/verify-return
# Xác thực kết quả thanh toán khi user quay lại website
```

## 🎨 UI Components

### PaymentMethodSelector

```tsx
// Toggle giữa 3 phương thức thanh toán
<PaymentMethodSelector
  selectedMethod={selectedPaymentMethod}
  onMethodChange={setSelectedPaymentMethod}
/>
```

### VNPayPayment

```tsx
// Component thanh toán VNPay với UI đẹp
<VNPayPayment
  amount={100000}
  orderInfo="Thanh toan template"
  orderId="ORDER_123"
  onSuccess={(transactionId) => console.log("Success!")}
  onError={(error) => console.log("Error:", error)}
/>
```

## 🔒 Security Features

### 1. Secure Hash Verification

```typescript
// Tất cả request/response đều được verify bằng HMAC SHA512
const secureHash = crypto
  .createHmac("sha512", hashSecret)
  .update(queryString)
  .digest("hex");
```

### 2. IP Address Tracking

```typescript
// Lưu IP address của user để audit
const ipAddr = request.headers.get("x-forwarded-for") || "127.0.0.1";
```

### 3. Order ID Uniqueness

```typescript
// Mỗi giao dịch có order ID duy nhất
const orderId = `TEMPLATE_${templateId}_${Date.now()}`;
```

## 🧪 Testing

### 1. Sandbox Environment

```bash
# URL Sandbox
https://sandbox.vnpayment.vn/paymentv2/vpcpay.html

# Demo page
http://sandbox.vnpayment.vn/tryitnow/Home/CreateOrder
```

### 2. Test Cards

```bash
# Thành công
NCB: 9704198526191432198 (OTP: 123456)

# Không đủ số dư
NCB: 9704195798459170488

# Thẻ bị khóa
NCB: 9704194841945513
```

### 3. Response Codes

```typescript
'00': 'Giao dịch thành công',
'07': 'Trừ tiền thành công (nghi ngờ gian lận)',
'09': 'Chưa đăng ký InternetBanking',
'10': 'Xác thực sai quá 3 lần',
'11': 'Hết hạn chờ thanh toán',
'12': 'Thẻ bị khóa',
'24': 'Khách hàng hủy giao dịch',
'51': 'Không đủ số dư',
'99': 'Lỗi khác'
```

## 🚀 Production Deployment

### 1. Cập nhật Environment Variables

```bash
# Production values
VNPAY_TMN_CODE=YOUR_PRODUCTION_CODE
VNPAY_HASH_SECRET=YOUR_PRODUCTION_SECRET
VNPAY_URL=https://pay.vnpay.vn/vpcpay.html
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
```

### 2. SSL Certificate

```bash
# VNPay yêu cầu HTTPS cho production
# Đảm bảo website có SSL certificate hợp lệ
```

### 3. Webhook Configuration

```bash
# Đăng ký IPN URL với VNPay
IPN_URL: https://yourdomain.com/api/vnpay/ipn
Return_URL: https://yourdomain.com/vnpay/return
```

## 🎯 Best Practices

### 1. Error Handling

```typescript
// Luôn handle tất cả error cases
try {
  const result = await vnpayService.createPaymentUrl(params);
} catch (error) {
  // Log error và show user-friendly message
  console.error("VNPay error:", error);
  showErrorMessage("Có lỗi xảy ra, vui lòng thử lại");
}
```

### 2. Logging

```typescript
// Log tất cả giao dịch quan trọng
console.log("🏴‍☠️ VNPay payment created:", {
  orderId,
  amount,
  timestamp: new Date().toISOString(),
});
```

### 3. Database Updates

```typescript
// Chỉ update database sau khi verify thành công
if (verificationResult.isValid && verificationResult.isSuccess) {
  await updateOrderStatus(orderId, "PAID");
  await sendConfirmationEmail(userEmail);
}
```

## 🆘 Troubleshooting

### 1. Invalid Signature Error

```bash
# Kiểm tra:
- Hash Secret đúng chưa?
- Query string có được sort alphabetically?
- Encoding có đúng UTF-8?
```

### 2. Payment URL không hoạt động

```bash
# Kiểm tra:
- TMN Code đúng chưa?
- Amount có nhân 100 chưa?
- Return URL có accessible?
```

### 3. IPN không nhận được

```bash
# Kiểm tra:
- IPN URL có public accessible?
- Server có respond đúng format?
- Firewall có block request từ VNPay?
```

## 📞 Support

- **VNPay Hotline**: 1900 55 55 77
- **Email**: hotrovnpay@vnpay.vn
- **Documentation**: https://sandbox.vnpayment.vn/apis/docs/

---

🏴‍☠️ **Made with ❤️ by GenG Pirates** - Code đẹp, logic chuẩn, UI xịn! ⚡
