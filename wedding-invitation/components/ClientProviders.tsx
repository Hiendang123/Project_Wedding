"use client";

import { ReactNode } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { useWalletHydration } from "@/hooks/useHydration";

// RainbowKit + wagmi
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider, http } from "wagmi";
import { sepolia } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// 🏴‍☠️ Create stable instances outside component - GenG style!
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      refetchOnWindowFocus: false,
      retry: false, // Disable retry for better hydration
    },
  },
});

const wagmiConfig = getDefaultConfig({
  appName: "WeddingCard",
  projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID || "demo",
  chains: [sepolia],
  transports: {
    [sepolia.id]: http("https://sepolia.infura.io/v3/"),
  },
  ssr: true, // Enable SSR support
});

export default function ClientProviders({ children }: { children: ReactNode }) {
  const isWalletReady = useWalletHydration();

  // 🎯 Base providers that work on both server and client - GenG style!
  const baseContent = (
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

  // 🏴‍☠️ Return base content during SSR and before hydration - GenG style!
  if (!isWalletReady) {
    return baseContent;
  }

  // 🚀 Full providers after successful hydration
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          modalSize="compact"
          initialChain={sepolia}
          showRecentTransactions={true}
        >
          {baseContent}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
