import { useEffect, useState } from "react";

/**
 * 🏴‍☠️ Custom hook to handle hydration properly - GenG style!
 * Prevents hydration mismatches between server and client
 */
export function useHydration() {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // 🎯 Wait for DOM to be fully ready - GenG approved!
    const timer = setTimeout(() => {
      setIsHydrated(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return isHydrated;
}

/**
 * 🚀 Hook specifically for wallet-related components - GenG style!
 * Handles RainbowKit/Wagmi hydration issues
 */
export function useWalletHydration() {
  const [isWalletReady, setIsWalletReady] = useState(false);

  useEffect(() => {
    // 🏴‍☠️ Extra delay for wallet components - GenG style!
    const timer = setTimeout(() => {
      setIsWalletReady(true);
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  return isWalletReady;
}
