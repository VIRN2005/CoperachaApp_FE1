import { Address } from 'viem';

// Tipos para los enums del contrato
export enum ProposalType {
  WITHDRAWAL = 0,
  ADD_MEMBER = 1,
}

export enum ProposalStatus {
  PENDING = 0,
  EXECUTED = 1,
  REJECTED = 2,
}

// Configuración de contratos por red
export const CONTRACTS = {
  // Sepolia Testnet
  11155111: {
    CoperachaFactory: '0x0000000000000000000000000000000000000000' as Address, 
  },
  // Base Sepolia Testnet
  84532: {
    CoperachaFactory: '0x5c90927EAb2fD25a07Bdc02E577EeffA4453b7a0' as Address,
  },
  // Tenderly Virtual Mainnet
  73571: {
    CoperachaFactory: '0xcC089ddA7CEe01285F3A8CE500cc3A0fAB5Af01F' as Address,
  },
  // Hardhat Local
  31337: {
    CoperachaFactory: '0xA51c1fc2f0D1a1b8494Ed1FE312d7C3a78Ed91C0' as Address,
  },
  // Localhost
  1337: {
    CoperachaFactory: '0x9E545E3C0baAB3E08CdfD552C960A1050f373042' as Address,
  },
} as const;

export type SupportedChainId = keyof typeof CONTRACTS;

// Configuración de exploradores por red
const BLOCK_EXPLORERS: Record<number, { name: string; url: string }> = {
  1: { name: 'Etherscan', url: 'https://etherscan.io' },
  11155111: { name: 'Etherscan', url: 'https://sepolia.etherscan.io' },
  8453: { name: 'Basescan', url: 'https://basescan.org' },
  84532: { name: 'Basescan', url: 'https://sepolia.basescan.org' },
  42161: { name: 'Arbiscan', url: 'https://arbiscan.io' },
  421614: { name: 'Arbiscan', url: 'https://sepolia.arbiscan.io' },
  10: { name: 'Optimism Explorer', url: 'https://optimistic.etherscan.io' },
  11155420: { name: 'Optimism Explorer', url: 'https://sepolia-optimistic.etherscan.io' },
  137: { name: 'PolygonScan', url: 'https://polygonscan.com' },
  80002: { name: 'PolygonScan', url: 'https://amoy.polygonscan.com' },
  73571: { name: 'Tenderly', url: 'https://virtual.mainnet.eu.rpc.tenderly.co/7042ed98-361d-42ee-a417-b6f62b0e4691' },
  31337: { name: 'Local Explorer', url: '#' },
  1337: { name: 'Local Explorer', url: '#' },
};

// Helper para obtener la dirección del factory según la red
export function getFactoryAddress(chainId: number): Address | undefined {
  return CONTRACTS[chainId as SupportedChainId]?.CoperachaFactory;
}

// Helper para verificar si una red está soportada y tiene contratos desplegados
export function isSupportedChain(chainId: number): boolean {
  const address = getFactoryAddress(chainId);
  return address !== undefined && address !== '0x0000000000000000000000000000000000000000';
}

// Helper para obtener lista de redes soportadas con contratos desplegados
export function getSupportedChains(): Array<{ chainId: number, name: string }> {
  const chainNames: Record<number, string> = {
    1: 'Ethereum Mainnet',
    11155111: 'Sepolia',
    8453: 'Base',
    84532: 'Base Sepolia',
    42161: 'Arbitrum',
    421614: 'Arbitrum Sepolia',
    10: 'Optimism',
    11155420: 'Optimism Sepolia',
    137: 'Polygon',
    80002: 'Polygon Amoy',
    31337: 'Hardhat',
    1337: 'Localhost',
  };

  return Object.keys(CONTRACTS)
    .map(chainId => Number(chainId))
    .filter(isSupportedChain)
    .map(chainId => ({
      chainId,
      name: chainNames[chainId] || `Chain ${chainId}`
    }));
}

// Helper para obtener el explorador de bloques según la red
export function getBlockExplorer(chainId: number): { name: string; url: string } {
  return BLOCK_EXPLORERS[chainId] || { name: 'Explorer', url: '#' };
}

// Helper para obtener URL de transacción en el explorador
export function getTransactionUrl(chainId: number, txHash: string): string {
  const explorer = getBlockExplorer(chainId);
  if (explorer.url === '#') return '#'; // Redes locales
  return `${explorer.url}/tx/${txHash}`;
}

// Helper para obtener URL de dirección en el explorador
export function getAddressUrl(chainId: number, address: string): string {
  const explorer = getBlockExplorer(chainId);
  if (explorer.url === '#') return '#'; // Redes locales
  return `${explorer.url}/address/${address}`;
}
