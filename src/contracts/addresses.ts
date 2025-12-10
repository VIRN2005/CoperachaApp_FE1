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
  // Hardhat Local
  31337: {
    CoperachaFactory: '0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6' as Address,
  },
  // Localhost
  1337: {
    CoperachaFactory: '0x9E545E3C0baAB3E08CdfD552C960A1050f373042' as Address,
  },
} as const;

export type SupportedChainId = keyof typeof CONTRACTS;

// Helper para obtener la dirección del factory según la red
export function getFactoryAddress(chainId: number): Address | undefined {
  return CONTRACTS[chainId as SupportedChainId]?.CoperachaFactory;
}
