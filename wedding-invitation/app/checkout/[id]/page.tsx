"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertCircle, ArrowLeft } from "lucide-react";
import axios from "axios";
import { API_ENDPOINTS } from "@/app/config/api";
import { Template } from "@/interface/Template";

// Payment components
import { PaymentMethodSelector } from "@/components/PaymentMethodSelector";
import { StripePayment } from "@/components/StripePayment";
import { CryptoPaymentSafe } from "@/components/CryptoPaymentSafe";
import { WalletWrapper } from "@/components/WalletWrapper";

export default function CheckoutPage() {
  const router = useRouter();
  const { id } = useParams() as { id: string };
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const [template, setTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    "stripe" | "crypto"
  >("stripe");
  const [isCreatingInvitation, setIsCreatingInvitation] = useState(false);
  const [paymentResult, setPaymentResult] = useState<{
    success: boolean;
    method: "stripe" | "crypto";
    transactionId?: string;
    error?: string;
  } | null>(null);
  const [previewValues, setPreviewValues] = useState<Record<string, string>>(
    {}
  );

  // 🏴‍☠️ Get wedding info from template - GenG style!
  const getWeddingInfoFromTemplate = () => {
    // 🎯 Try to get saved preview values from localStorage first - GenG approved!
    let previewValues: Record<string, string> = {};
    try {
      const savedValues = localStorage.getItem(`template_${id}_previewValues`);
      if (savedValues) {
        previewValues = JSON.parse(savedValues);
        console.log("🏴‍☠️ Found saved preview values:", previewValues);
      }
    } catch (error) {
      console.log("🏴‍☠️ No saved preview values found, using defaults");
    }

    const brideName =
      previewValues["tên_cô_dâu"] ||
      template?.dynamicFields?.find((f) => f.name === "tên_cô_dâu")
        ?.defaultValue ||
      "Cô Dâu";
    const groomName =
      previewValues["tên_chú_rể"] ||
      template?.dynamicFields?.find((f) => f.name === "tên_chú_rể")
        ?.defaultValue ||
      "Chú Rể";
    const weddingDate =
      previewValues["ngày_cưới"] ||
      template?.dynamicFields?.find((f) => f.name === "ngày_cưới")
        ?.defaultValue ||
      new Date().toLocaleDateString("vi-VN");
    const venue =
      previewValues["tên_địa_điểm"] ||
      template?.dynamicFields?.find((f) => f.name === "tên_địa_điểm")
        ?.defaultValue ||
      "Nhà hàng";
    const address =
      previewValues["địa_chỉ"] ||
      template?.dynamicFields?.find((f) => f.name === "địa_chỉ")
        ?.defaultValue ||
      "Địa chỉ";

    return { brideName, groomName, weddingDate, venue, address, previewValues };
  };

  // 🎯 Function to replace placeholders in HTML/CSS with actual values - GenG style!
  const replacePlaceholders = (content: string) => {
    if (!template) return content;

    let result = content;
    const weddingInfo = getWeddingInfoFromTemplate();

    // Use preview values if available, otherwise use default values
    const valuesToUse =
      Object.keys(weddingInfo.previewValues).length > 0
        ? weddingInfo.previewValues
        : previewValues;

    // Replace placeholders with actual values
    Object.entries(valuesToUse).forEach(([key, value]) => {
      const placeholder = `{{${key}}}`;
      // Handle images specially
      if (key.includes("ảnh") || key.includes("image")) {
        if (value.startsWith("http") || value.startsWith("/")) {
          result = result.replace(new RegExp(placeholder, "g"), value);
        } else {
          result = result.replace(
            new RegExp(placeholder, "g"),
            "/placeholder-image.jpg"
          );
        }
      } else {
        result = result.replace(new RegExp(placeholder, "g"), value || "");
      }
    });

    return result;
  };

  // 🎯 Update iframe content when template or preview values change - GenG style!
  useEffect(() => {
    if (!template) return;

    const iframeContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { margin: 0; padding: 20px; }
            ${replacePlaceholders(template.css)}
          </style>
        </head>
        <body>
          ${replacePlaceholders(template.html)}
          <script>
            ${template.js}
          </script>
        </body>
      </html>
    `;

    if (iframeRef.current) {
      iframeRef.current.srcdoc = iframeContent;
    }
  }, [template, previewValues]);

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const res = await axios.get<Template>(
          `${API_ENDPOINTS.templates}/${id}`
        );
        setTemplate(res.data);

        // 🎯 Initialize preview values with saved values or defaults - GenG style!
        let savedValues: Record<string, string> = {};
        try {
          const savedData = localStorage.getItem(
            `template_${id}_previewValues`
          );
          if (savedData) {
            savedValues = JSON.parse(savedData);
            console.log("🏴‍☠️ Found saved preview values:", savedValues);
          }
        } catch (error) {
          console.log("🏴‍☠️ No saved preview values found, using defaults");
        }

        if (Object.keys(savedValues).length > 0) {
          setPreviewValues(savedValues);
        } else {
          // Initialize with default values
          const initialValues: Record<string, string> = {};
          res.data.dynamicFields?.forEach((field) => {
            initialValues[field.name] = field.defaultValue || "";
          });
          setPreviewValues(initialValues);
        }
      } catch (e) {
        setError("Không thể tải mẫu thiệp. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };
    fetchTemplate();
  }, [id]);

  const handlePaymentSuccess = async (
    transactionId: string,
    method: "stripe" | "crypto"
  ) => {
    if (!template) return;

    try {
      setIsCreatingInvitation(true);

      // 🏴‍☠️ Get wedding info from template - GenG style!
      const weddingInfo = getWeddingInfoFromTemplate();
      const timestamp = Date.now();

      // 🎯 Create complete fields object - GenG approved!
      const fields: Record<string, string> = {};

      // First, add all template fields with their default values
      template.dynamicFields?.forEach((field) => {
        fields[field.name] = field.defaultValue || "";
      });

      // Then, override with saved preview values if available
      if (
        weddingInfo.previewValues &&
        Object.keys(weddingInfo.previewValues).length > 0
      ) {
        Object.entries(weddingInfo.previewValues).forEach(([key, value]) => {
          if (value) {
            fields[key] = value;
          }
        });
        console.log(
          "🏴‍☠️ Using preview values for fields:",
          weddingInfo.previewValues
        );
      }

      // Override names with timestamp for uniqueness (but keep original for display)
      fields.tên_cô_dâu = `${weddingInfo.brideName} ${timestamp}`;
      fields.tên_chú_rể = `${weddingInfo.groomName} ${timestamp}`;

      // 🧹 Clean up localStorage after using the data - GenG style!
      try {
        localStorage.removeItem(`template_${id}_previewValues`);
      } catch (error) {
        console.log("🏴‍☠️ Could not clean up localStorage");
      }

      // 🏴‍☠️ Create wedding invitation after successful payment - GenG style!
      const weddingInvitationData = {
        templateId: template._id,
        userId: null, // Demo mode - no authentication required
        fields: fields,
      };

      console.log("🏴‍☠️ Creating wedding invitation:", {
        url: `${API_ENDPOINTS.weddingInvitations}`,
        data: weddingInvitationData,
      });

      const response = await axios.post(
        `${API_ENDPOINTS.weddingInvitations}`,
        weddingInvitationData
      );
      const createdInvitation = response.data as {
        slug?: string;
        data?: { slug?: string };
      };

      // 🚀 Redirect to wedding invitation page using slug
      const slug = createdInvitation.slug || createdInvitation.data?.slug;
      if (slug) {
        console.log("🏴‍☠️ Redirecting to wedding invitation:", slug);
        // Small delay for better UX
        setTimeout(() => {
          router.push(`/wedding/${slug}`);
        }, 1000);
      } else {
        // Fallback to success page if no slug
        setIsCreatingInvitation(false);
        setPaymentResult({
          success: true,
          method,
          transactionId,
        });
      }
    } catch (error: any) {
      console.error("Error creating wedding invitation:", error);
      setIsCreatingInvitation(false);
      // Show success but with error creating invitation
      setPaymentResult({
        success: true,
        method,
        transactionId,
        error:
          "Thanh toán thành công nhưng có lỗi tạo thiệp cưới. Vui lòng liên hệ hỗ trợ.",
      });
    }
  };

  const handlePaymentError = (error: string) => {
    setPaymentResult({
      success: false,
      method: selectedPaymentMethod,
      error,
    });
  };

  const resetPayment = () => {
    setPaymentResult(null);
  };

  // 🎯 Always allow payment since we get info from template - GenG style!
  const isWeddingInfoValid = true;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
        <Spinner size="lg" />
      </div>
    );
  }

  // 🎉 Creating wedding invitation loading screen
  if (isCreatingInvitation) {
    return (
      <div className="min-h-screen flex flex-col bg-white dark:bg-black text-gray-900 dark:text-white">
        <Header />
        <main className="flex-1 container mx-auto py-8 px-4 flex items-center justify-center">
          <Card className="max-w-2xl w-full border-green-200 dark:border-green-800">
            <CardContent className="text-center space-y-6 p-8">
              <CheckCircle className="h-24 w-24 text-green-500 mx-auto" />
              <div className="space-y-4">
                <h1 className="text-3xl font-bold text-green-700 dark:text-green-400">
                  Thanh toán thành công! 🎉
                </h1>
                <div className="flex items-center justify-center gap-3">
                  <Spinner size="sm" />
                  <p className="text-lg text-gray-600 dark:text-gray-300">
                    Đang tạo thiệp cưới của bạn...
                  </p>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Bạn sẽ được chuyển đến thiệp cưới trong giây lát
                </p>
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !template) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-white dark:bg-black text-center">
        <p className="text-red-600 dark:text-red-400 text-lg font-medium max-w-md">
          {error || "Đã xảy ra lỗi."}
        </p>
        <Button onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại
        </Button>
      </div>
    );
  }

  // 🎉 Payment success screen
  if (paymentResult?.success) {
    return (
      <div className="min-h-screen flex flex-col bg-white dark:bg-black text-gray-900 dark:text-white">
        <Header />
        <main className="flex-1 container mx-auto py-8 px-4 flex items-center justify-center">
          <Card className="max-w-2xl w-full border-green-200 dark:border-green-800">
            <CardContent className="text-center space-y-6 p-8">
              <CheckCircle className="h-24 w-24 text-green-500 mx-auto" />
              <div className="space-y-2">
                <h1 className="text-3xl font-bold text-green-700 dark:text-green-400">
                  Thanh toán thành công! 🎉
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  Cảm ơn bạn đã mua template "{template.name}"
                </p>
              </div>

              <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Phương thức:</span>
                    <Badge
                      variant="outline"
                      className={
                        paymentResult.method === "stripe"
                          ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-300"
                          : "bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-300"
                      }
                    >
                      {paymentResult.method === "stripe" ? "Stripe" : "Crypto"}
                    </Badge>
                  </div>
                  {paymentResult.transactionId && (
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Mã giao dịch:</span>
                      <span className="text-sm font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-gray-600 dark:text-gray-300">
                        {paymentResult.transactionId.slice(0, 20)}...
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <Button
                  onClick={() => router.push("/templates")}
                  variant="outline"
                >
                  Xem thêm template
                </Button>
                <Button onClick={() => router.push("/")}>Về trang chủ</Button>
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <WalletWrapper>
      <div className="min-h-screen flex flex-col bg-white dark:bg-black text-gray-900 dark:text-white">
        <Header />
        <main className="flex-1 container mx-auto py-8 px-4 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Preview */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Quay lại
              </Button>
            </div>
            <h2 className="text-2xl font-bold">Xem trước template</h2>

            {/* 🏴‍☠️ Dynamic iframe preview instead of static thumbnail - GenG style! */}
            <div className="border rounded-lg overflow-hidden shadow dark:border-gray-700 bg-white">
              <iframe
                ref={iframeRef}
                className="w-full h-[600px] border-0"
                title="Template Preview"
                sandbox="allow-scripts"
              />
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">{template.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Mã template: {template._id}
              </p>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-pink-600 dark:text-pink-400">
                  {template.priceAmount.toLocaleString("vi-VN")} VNĐ
                </span>
                <Badge variant="secondary">
                  {template.category || "Wedding"}
                </Badge>
              </div>
            </div>
          </div>

          {/* Payment Section */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Thanh toán</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Chọn phương thức thanh toán phù hợp với bạn
              </p>
            </div>

            {/* Payment Method Selector */}
            <PaymentMethodSelector
              selectedMethod={selectedPaymentMethod}
              onMethodChange={setSelectedPaymentMethod}
            />

            {/* Payment Error Alert */}
            {paymentResult?.error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {paymentResult.error}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetPayment}
                    className="ml-2 text-red-600 hover:text-red-700"
                  >
                    Thử lại
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            {/* Payment Component */}
            <div>
              {selectedPaymentMethod === "stripe" ? (
                <StripePayment
                  template={template}
                  onSuccess={(paymentIntentId) =>
                    handlePaymentSuccess(paymentIntentId, "stripe")
                  }
                  onError={handlePaymentError}
                />
              ) : (
                <CryptoPaymentSafe
                  template={template}
                  onSuccess={(transactionHash: string) =>
                    handlePaymentSuccess(transactionHash, "crypto")
                  }
                  onError={handlePaymentError}
                />
              )}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </WalletWrapper>
  );
}
