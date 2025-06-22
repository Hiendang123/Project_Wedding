"use client";

import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { CheckCircle, CreditCard, AlertCircle } from "lucide-react";
import { Template } from "@/interface/Template";

// 🏴‍☠️ Initialize Stripe - GenG style!
// Note: Environment variable phải có prefix NEXT_PUBLIC_ để dùng được ở client-side
// Trong file .env: NEXT_PUBLIC_PUBLISHABLE_KEY_STRIPE=pk_test_your_key_here
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_PUBLISHABLE_KEY_STRIPE!
);

interface StripePaymentProps {
  template: Template;
  onSuccess: (paymentIntentId: string) => void;
  onError: (error: string) => void;
  className?: string;
}

interface PaymentFormProps {
  template: Template;
  onSuccess: (paymentIntentId: string) => void;
  onError: (error: string) => void;
}

function PaymentForm({ template, onSuccess, onError }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState<string>("");
  const [paymentStatus, setPaymentStatus] = useState<{
    type: "idle" | "processing" | "success" | "error";
    message?: string;
  }>({ type: "idle" });

  // 🚀 Create payment intent when component mounts
  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const response = await fetch("/api/stripe/create-payment-intent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: template.priceAmount / 25000, // Convert VND to USD (rough conversion)
            currency: "usd",
            templateId: template._id,
            templateName: template.name,
          }),
        });

        const data = await response.json();
        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
        } else {
          onError(data.error || "Failed to create payment intent");
        }
      } catch (error: any) {
        onError(error.message || "Failed to initialize payment");
      }
    };

    createPaymentIntent();
  }, [template, onError]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      return;
    }

    setIsProcessing(true);
    setPaymentStatus({
      type: "processing",
      message: "Đang xử lý thanh toán...",
    });

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setIsProcessing(false);
      onError("Card element not found");
      return;
    }

    try {
      // 🏴‍☠️ Confirm payment with Stripe - GenG style!
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: "Wedding Template Customer",
            },
          },
        }
      );

      if (error) {
        setPaymentStatus({
          type: "error",
          message: error.message || "Payment failed",
        });
        onError(error.message || "Payment failed");
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        setPaymentStatus({
          type: "success",
          message: "Thanh toán thành công! 🎉",
        });
        onSuccess(paymentIntent.id);
      }
    } catch (error: any) {
      setPaymentStatus({
        type: "error",
        message: error.message || "Unexpected error occurred",
      });
      onError(error.message || "Unexpected error occurred");
    } finally {
      setIsProcessing(false);
    }
  };

  if (paymentStatus.type === "success") {
    return (
      <div className="text-center space-y-4 p-6">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
        <h3 className="text-xl font-semibold text-green-700 dark:text-green-400">
          Thanh toán thành công!
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          Cảm ơn bạn đã mua template. Bạn có thể sử dụng ngay bây giờ!
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Thông tin thẻ tín dụng
          </label>
          <div className="border rounded-md p-3 bg-white dark:bg-gray-900">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: "16px",
                    color: "#424770",
                    "::placeholder": {
                      color: "#aab7c4",
                    },
                  },
                  invalid: {
                    color: "#9e2146",
                  },
                },
                hidePostalCode: true,
              }}
            />
          </div>
        </div>

        {paymentStatus.type === "error" && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{paymentStatus.message}</AlertDescription>
          </Alert>
        )}

        <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex justify-between items-center">
            <span className="font-medium">Tổng thanh toán:</span>
            <div className="text-right">
              <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                ${(template.priceAmount / 25000).toFixed(2)} USD
              </div>
              <div className="text-sm text-gray-500">
                (~{template.priceAmount.toLocaleString("vi-VN")} VNĐ)
              </div>
            </div>
          </div>
        </div>
      </div>

      <Button
        type="submit"
        disabled={!stripe || isProcessing || !clientSecret}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3"
      >
        {isProcessing ? (
          <>
            <Spinner size="sm" className="mr-2" />
            Đang xử lý...
          </>
        ) : (
          <>
            <CreditCard className="mr-2 h-4 w-4" />
            Thanh toán ${(template.priceAmount / 25000).toFixed(2)}
          </>
        )}
      </Button>

      <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
        Thông tin thẻ của bạn được bảo vệ bởi mã hóa SSL 256-bit
      </p>
    </form>
  );
}

export function StripePayment({
  template,
  onSuccess,
  onError,
  className = "",
}: StripePaymentProps) {
  return (
    <Card className={`${className} border-blue-200 dark:border-blue-800`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
          <CreditCard className="h-5 w-5" />
          Thanh toán bằng thẻ tín dụng
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Elements stripe={stripePromise}>
          <PaymentForm
            template={template}
            onSuccess={onSuccess}
            onError={onError}
          />
        </Elements>
      </CardContent>
    </Card>
  );
}
