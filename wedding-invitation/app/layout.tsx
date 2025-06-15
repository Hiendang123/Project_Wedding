import type React from "react";
import "@/app/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import ClientProviders from "@/components/ClientProviders";

const inter = Inter({ subsets: ["latin"] });

// ---- RainbowKit + wagmi providers ----
// provider moved to client component

export const metadata: Metadata = {
  title: "WeddingCard - Thiệp cưới online đẹp mắt và độc đáo",
  description:
    "Tạo thiệp cưới online dễ dàng, nhanh chóng và chia sẻ với người thân, bạn bè chỉ với vài bước đơn giản.",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      {/* suppressHydrationWarning to avoid mismatch issues */}
      <body suppressHydrationWarning className={inter.className}>
        <Suspense fallback={<div>Loading...</div>}>
          <ClientProviders>{children}</ClientProviders>
        </Suspense>
      </body>
    </html>
  );
}
