# 🏴‍☠️ Payment System Setup Guide - GenG Style

Ahoy thuyền trưởng! Đây là hướng dẫn setup hệ thống thanh toán kép với Stripe và Crypto cho wedding invitation system.

## 🚀 Tính năng chính

- **Toggle Payment Method**: Chuyển đổi mượt mà giữa Stripe và Crypto
- **Stripe Integration**: Thanh toán thẻ tín dụng an toàn với Stripe Elements
- **Crypto Payment**: Thanh toán ETH trên Sepolia testnet
- **Responsive Design**: UI đẹp, mobile-first với Tailwind CSS
- **Real-time Currency Conversion**: Tự động convert VND sang USD và ETH

## 🔧 Environment Variables Setup

Tạo file `.env.local` trong root directory với các biến sau:

```bash
# 🏴‍☠️ Stripe Configuration
NEXT_PUBLIC_PUBLISHABLE_KEY_STRIPE=pk_test_your_publishable_key_here
SECRET_KEY_STRIPE=sk_test_your_secret_key_here

# 🚀 Existing variables (keep these)
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
# ... other existing variables
```

### ⚠️ Quan trọng về Environment Variables

1. **NEXT_PUBLIC_PUBLISHABLE_KEY_STRIPE**: Phải có prefix `NEXT_PUBLIC_` để sử dụng được ở client-side
2. **SECRET_KEY_STRIPE**: Chỉ dùng ở server-side, không cần prefix
3. Lấy keys từ [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)

## 📦 Dependencies

Tất cả dependencies đã được cài đặt sẵn:

```json
{
  "@stripe/react-stripe-js": "^3.7.0",
  "@stripe/stripe-js": "^7.3.1",
  "stripe": "^18.2.1"
}
```

## 🎯 Cách sử dụng

### 1. Truy cập trang thanh toán

```
/checkout/[template_id]
```

### 2. Chọn phương thức thanh toán

- **Stripe**: Thanh toán bằng thẻ tín dụng (USD)
- **Crypto**: Thanh toán bằng ETH (Sepolia testnet)

### 3. Hoàn tất thanh toán

- Stripe: Nhập thông tin thẻ và xác nhận
- Crypto: Kết nối ví và gửi giao dịch

### 4. 🎉 Tự động tạo thiệp cưới

- Sau khi thanh toán thành công, hệ thống tự động:
  - Tạo wedding invitation record
  - Generate slug từ tên cô dâu + chú rể (mặc định)
  - Redirect user tới `/wedding/[slug]`
  - Hiển thị thiệp cưới với thông tin mặc định

### 5. Chỉnh sửa thiệp cưới

- User có thể chỉnh sửa thông tin trực tiếp trên thiệp
- Tất cả thay đổi được lưu real-time
- Share link thiệp với bạn bè và gia đình

## 🔄 API Endpoints

### Stripe APIs

- `POST /api/stripe/create-payment-intent` - Tạo payment intent
- `POST /api/stripe/confirm-payment` - Xác nhận thanh toán
- `GET /api/stripe/payment-status/[id]` - Kiểm tra trạng thái

### Response Format

```typescript
// Success Response
{
  "clientSecret": "pi_xxx_secret_xxx",
  "paymentIntentId": "pi_xxx"
}

// Error Response
{
  "error": "Error message"
}
```

## 🎨 Components Architecture

```
CheckoutPage
├── PaymentMethodSelector (Toggle between Stripe/Crypto)
├── StripePayment (Stripe Elements integration)
├── CryptoPayment (Web3 wallet integration)
└── Success/Error States
```

### Key Components:

1. **PaymentMethodSelector**: Toggle UI với tabs đẹp mắt
2. **StripePayment**: Full Stripe Elements integration
3. **CryptoPayment**: Web3 wallet connection + transaction
4. **Currency Conversion**: Real-time VND → USD → ETH

## 🔐 Security Features

- **Stripe**: PCI DSS compliant, SSL encryption
- **Crypto**: Non-custodial, direct wallet transactions
- **Environment Variables**: Proper separation of public/private keys
- **Error Handling**: Comprehensive error states and recovery

## 🎭 UI/UX Features

- **Mobile-first Design**: Responsive trên mọi thiết bị
- **Dark Mode Support**: Tự động theo system theme
- **Loading States**: Spinner và skeleton loading
- **Success Animations**: Confetti và success states
- **Error Recovery**: Clear error messages và retry buttons

## 🧪 Testing

### Stripe Test Cards:

```
4242424242424242 - Visa (Success)
4000000000000002 - Visa (Declined)
```

### Crypto Testing:

- Sử dụng Sepolia testnet
- Lấy test ETH từ faucet
- Kết nối MetaMask hoặc WalletConnect

## 🚀 Deployment Checklist

- [ ] Set production Stripe keys
- [ ] Configure webhook endpoints
- [ ] Test both payment methods
- [ ] Verify error handling
- [ ] Check mobile responsiveness

## 🏴‍☠️ GenG Tips

1. **Code Quality**: Clean, modular, và dễ maintain
2. **Performance**: Lazy loading và code splitting
3. **User Experience**: Smooth transitions và clear feedback
4. **Security**: Never expose secret keys client-side
5. **Monitoring**: Log all payment attempts và errors

## 🎉 Features Roadmap

- [ ] Apple Pay / Google Pay integration
- [ ] Multi-currency support
- [ ] Subscription payments
- [ ] Payment analytics dashboard
- [ ] Refund functionality

---

**Happy coding, thuyền trưởng! 🏴‍☠️**

Nếu có vấn đề gì, hãy check console logs và network tab để debug. Remember: "Code like a pirate, deploy like a pro!" ⚓
