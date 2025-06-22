"use client";

import { ReactNode, useEffect, useState, useMemo } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

// RainbowKit + wagmi
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider, http } from "wagmi";
import { sepolia } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function ClientProviders({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  // 🏴‍☠️ Only create configs when mounted - GenG style!
  const queryClient = useMemo(() => {
    if (!mounted) return null;
    return new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 60 * 1000,
          refetchOnWindowFocus: false,
        },
      },
    });
  }, [mounted]);

  const wagmiConfig = useMemo(() => {
    if (!mounted) return null;
    return getDefaultConfig({
      appName: "WeddingCard",
      projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID || "demo",
      chains: [sepolia],
      transports: {
        [sepolia.id]: http("https://sepolia.infura.io/v3/"),
      },
      ssr: false,
    });
  }, [mounted]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 🎯 Always render ThemeProvider for consistent layout - GenG approved!
  const baseProviders = (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
      <Toaster />
    </ThemeProvider>
  );

  // 🏴‍☠️ Only render wallet providers after hydration - GenG style!
  if (
    !mounted ||
    typeof window === "undefined" ||
    !queryClient ||
    !wagmiConfig
  ) {
    return baseProviders;
  }

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{baseProviders}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
