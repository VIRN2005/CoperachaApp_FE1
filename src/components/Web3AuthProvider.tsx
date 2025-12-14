"use client";

import { ReactNode } from "react";
import { WagmiProvider, createConfig, http } from "wagmi";
import type { Chain } from "wagmi/chains";
import {
  mainnet,
  sepolia,
  hardhat,
  localhost,
  base,
  baseSepolia,
  arbitrum,
  arbitrumSepolia,
  optimism,
  optimismSepolia,
  polygon,
  polygonAmoy,
} from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RainbowKitProvider, getDefaultConfig } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { getSupportedChains } from "../contracts/addresses";

// Crear chain personalizada para Tenderly Virtual Mainnet
const tenderlyVirtualMainnet: Chain = {
  id: 73571,
  name: "Tenderly Virtual Mainnet",
  nativeCurrency: {
    decimals: 18,
    name: "Virtual ETH",
    symbol: "VETH",
  },
  rpcUrls: {
    default: {
      http: [
        "https://virtual.mainnet.eu.rpc.tenderly.co/90ce4a22-5494-4568-8d4b-a1530aff5790",
      ],
    },
  },
  blockExplorers: {
    default: {
      name: "Tenderly",
      url: "https://virtual.mainnet.eu.rpc.tenderly.co/7042ed98-361d-42ee-a417-b6f62b0e4691",
    },
  },
  testnet: true,
};

// Mapeo de chainId a objeto Chain de wagmi
const chainMap: Record<number, Chain> = {
  1: mainnet,
  11155111: sepolia,
  8453: base,
  84532: baseSepolia,
  42161: arbitrum,
  421614: arbitrumSepolia,
  10: optimism,
  11155420: optimismSepolia,
  137: polygon,
  80002: polygonAmoy,
  31337: hardhat,
  1337: localhost,
  73571: tenderlyVirtualMainnet,
};

// Obtener solo las chains donde hay contratos desplegados
const supportedChainIds = getSupportedChains().map((c) => c.chainId);
const supportedChains = supportedChainIds
  .map((chainId) => chainMap[chainId])
  .filter(Boolean) as [Chain, ...Chain[]]; // RainbowKit requiere al menos 1 chain

// Fallback si no hay chains configuradas (no debería pasar)
const chains: [Chain, ...Chain[]] =
  supportedChains.length > 0 ? supportedChains : [hardhat];

// Configuración de wagmi con RainbowKit - Solo redes con contratos desplegados
const config = getDefaultConfig({
  appName: "Coperacha App",
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || "demo_project_id",
  chains,
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
