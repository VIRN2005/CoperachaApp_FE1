"use client";

import { ReactNode } from "react";
import { WagmiProvider, createConfig, http } from "wagmi";
import { mainnet, sepolia, hardhat, localhost } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RainbowKitProvider, getDefaultConfig } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";

// Configuración de wagmi con RainbowKit
const config = getDefaultConfig({
  appName: "Coperacha App",
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || "demo_project_id",
  chains: [sepolia, hardhat, localhost, mainnet],
  ssr: false,
});

const queryClient = new QueryClient();

export function Web3AuthProvider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

// Hook de compatibilidad para no romper código existente
export function useWeb3Auth() {
  // Este hook ya no se necesita, usar directamente:
  // - useAccount() para address y isConnected
  // - useBalance() para balance
  // - useDisconnect() para logout
  console.warn(
    "useWeb3Auth is deprecated. Use wagmi hooks directly: useAccount, useBalance, useDisconnect"
  );
  return {
    userAddress: null,
    balance: "0",
    login: async () => {},
    logout: () => {},
    isConnected: false,
  };
}
