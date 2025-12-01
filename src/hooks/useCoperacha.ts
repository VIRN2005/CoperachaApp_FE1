import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import { Address, parseEther } from 'viem';
import { CoperachaFactoryABI } from '../contracts/CoperachaFactoryABI';
import { CoperachaWalletABI } from '../contracts/CoperachaWalletABI';
import { getFactoryAddress } from '../contracts/addresses';

// ========================================
// HOOKS PARA COPERACHA FACTORY
// ========================================

/**
 * Crear una nueva Coperacha (wallet comunitaria)
 */
export function useCreateCoperacha() {
  const { chain } = useAccount();
  const { data: hash, writeContract, isPending, error } = useWriteContract();

  const createCoperacha = (name: string, members: Address[]) => {
    const factoryAddress = getFactoryAddress(chain?.id || 31337);
    if (!factoryAddress) {
      throw new Error('Factory address not configured for this network');
    }

    writeContract({
      address: factoryAddress,
      abi: CoperachaFactoryABI,
      functionName: 'createVault',
      args: [name, members],
    });
  };

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  return {
    createCoperacha,
    isPending,
    isConfirming,
    isSuccess,
    hash,
    error,
  };
}

/**
 * Obtener todas las Coperachas del usuario
 */
export function useUserCoperachas(userAddress?: Address) {
  const { chain } = useAccount();
  const factoryAddress = getFactoryAddress(chain?.id || 31337);

  return useReadContract({
    address: factoryAddress,
    abi: CoperachaFactoryABI,
    functionName: 'getUserVaults',
    args: userAddress ? [userAddress] : undefined,
    query: {
      enabled: !!userAddress && !!factoryAddress,
    },
  });
}

/**
 * Obtener todas las Coperachas del sistema
 */
export function useAllCoperachas() {
  const { chain } = useAccount();
  const factoryAddress = getFactoryAddress(chain?.id || 31337);

  return useReadContract({
    address: factoryAddress,
    abi: CoperachaFactoryABI,
    functionName: 'getAllVaults',
    query: {
      enabled: !!factoryAddress,
    },
  });
}

/**
 * Obtener información de una Coperacha específica
 */
export function useCoperachaInfo(vaultAddress?: Address) {
  const { chain } = useAccount();
  const factoryAddress = getFactoryAddress(chain?.id || 31337);

  return useReadContract({
    address: factoryAddress,
    abi: CoperachaFactoryABI,
    functionName: 'getVaultInfo',
    args: vaultAddress ? [vaultAddress] : undefined,
    query: {
      enabled: !!vaultAddress && !!factoryAddress,
    },
  });
}

/**
 * Obtener el total de Coperachas creadas
 */
export function useTotalCoperachas() {
  const { chain } = useAccount();
  const factoryAddress = getFactoryAddress(chain?.id || 31337);

  return useReadContract({
    address: factoryAddress,
    abi: CoperachaFactoryABI,
    functionName: 'getTotalVaults',
    query: {
      enabled: !!factoryAddress,
    },
  });
}

// ========================================
// HOOKS PARA COPERACHA WALLET (Individual)
// ========================================

/**
 * Depositar fondos en una Coperacha
 */
export function useDepositToCoperacha(vaultAddress?: Address) {
  const { data: hash, writeContract, isPending, error } = useWriteContract();

  const deposit = (amountInEth: string) => {
    if (!vaultAddress) {
      throw new Error('Vault address is required');
    }

    writeContract({
      address: vaultAddress,
      abi: CoperachaWalletABI,
      functionName: 'deposit',
      value: parseEther(amountInEth),
    });
  };

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  return {
    deposit,
    isPending,
    isConfirming,
    isSuccess,
    hash,
    error,
  };
}

/**
 * Crear propuesta de retiro
 */
export function useProposeWithdrawal(vaultAddress?: Address) {
  const { data: hash, writeContract, isPending, error } = useWriteContract();

  const proposeWithdrawal = (description: string, recipient: Address, amountInEth: string) => {
    if (!vaultAddress) {
      throw new Error('Vault address is required');
    }

    writeContract({
      address: vaultAddress,
      abi: CoperachaWalletABI,
      functionName: 'proposeWithdrawal',
      args: [description, recipient, parseEther(amountInEth)],
    });
  };

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  return {
    proposeWithdrawal,
    isPending,
    isConfirming,
    isSuccess,
    hash,
    error,
  };
}

/**
 * Crear propuesta para agregar miembro
 */
export function useProposeAddMember(vaultAddress?: Address) {
  const { data: hash, writeContract, isPending, error } = useWriteContract();

  const proposeAddMember = (description: string, newMember: Address) => {
    if (!vaultAddress) {
      throw new Error('Vault address is required');
    }

    writeContract({
      address: vaultAddress,
      abi: CoperachaWalletABI,
      functionName: 'proposeAddMember',
      args: [description, newMember],
    });
  };

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  return {
    proposeAddMember,
    isPending,
    isConfirming,
    isSuccess,
    hash,
    error,
  };
}

/**
 * Votar en una propuesta
 */
export function useVoteOnProposal(vaultAddress?: Address) {
  const { data: hash, writeContract, isPending, error } = useWriteContract();

  const vote = (proposalId: number, inFavor: boolean) => {
    if (!vaultAddress) {
      throw new Error('Vault address is required');
    }

    writeContract({
      address: vaultAddress,
      abi: CoperachaWalletABI,
      functionName: 'vote',
      args: [BigInt(proposalId), inFavor],
    });
  };

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  return {
    vote,
    isPending,
    isConfirming,
    isSuccess,
    hash,
    error,
  };
}

/**
 * Obtener información de una propuesta
 */
export function useProposalInfo(vaultAddress?: Address, proposalId?: number) {
  return useReadContract({
    address: vaultAddress,
    abi: CoperachaWalletABI,
    functionName: 'getProposalInfo',
    args: proposalId !== undefined ? [BigInt(proposalId)] : undefined,
    query: {
      enabled: !!vaultAddress && proposalId !== undefined,
    },
  });
}

/**
 * Obtener miembros de una Coperacha
 */
export function useCoperachaMembers(vaultAddress?: Address) {
  return useReadContract({
    address: vaultAddress,
    abi: CoperachaWalletABI,
    functionName: 'getMembers',
    query: {
      enabled: !!vaultAddress,
    },
  });
}

/**
 * Obtener balance de una Coperacha
 */
export function useCoperachaBalance(vaultAddress?: Address) {
  return useReadContract({
    address: vaultAddress,
    abi: CoperachaWalletABI,
    functionName: 'getBalance',
    query: {
      enabled: !!vaultAddress,
    },
  });
}

/**
 * Verificar si un usuario votó en una propuesta
 */
export function useHasVoted(vaultAddress?: Address, proposalId?: number, voterAddress?: Address) {
  return useReadContract({
    address: vaultAddress,
    abi: CoperachaWalletABI,
    functionName: 'hasVoted',
    args: proposalId !== undefined && voterAddress ? [BigInt(proposalId), voterAddress] : undefined,
    query: {
      enabled: !!vaultAddress && proposalId !== undefined && !!voterAddress,
    },
  });
}

/**
 * Verificar si una dirección es miembro de la Coperacha
 */
export function useIsMember(vaultAddress?: Address, memberAddress?: Address) {
  return useReadContract({
    address: vaultAddress,
    abi: CoperachaWalletABI,
    functionName: 'isMember',
    args: memberAddress ? [memberAddress] : undefined,
    query: {
      enabled: !!vaultAddress && !!memberAddress,
    },
  });
}
