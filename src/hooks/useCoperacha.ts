import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useAccount, useWatchContractEvent } from 'wagmi';
import { Address, parseEther } from 'viem';
import { CoperachaFactoryABI } from '../contracts/CoperachaFactoryABI';
import { CoperachaWalletABI } from '../contracts/CoperachaWalletABI';
import { getFactoryAddress } from '../contracts/addresses';
import { useState, useEffect } from 'react';
import { usePublicClient } from 'wagmi';

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

    return writeContract({
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
    isPending, // Estado mientras se envía la tx
    isConfirming, // Estado mientras se confirma en blockchain
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
      refetchInterval: 3000, // Refetch cada 3 segundos para detectar nuevas Coperachas
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
export function useDepositToCoperacha() {
  const { data: hash, writeContract, isPending, error } = useWriteContract();

  const deposit = (vaultAddress: Address, amountInWei: bigint) => {
    return writeContract({
      address: vaultAddress,
      abi: CoperachaWalletABI,
      functionName: 'deposit',
      value: amountInWei,
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
export function useProposeWithdrawal() {
  const { data: hash, writeContract, isPending, error } = useWriteContract();

  const proposeWithdrawal = (vaultAddress: Address, recipient: Address, amountInWei: bigint, description: string) => {
    return writeContract({
      address: vaultAddress,
      abi: CoperachaWalletABI,
      functionName: 'proposeWithdrawal',
      args: [description, recipient, amountInWei],
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
export function useVoteOnProposal() {
  const { data: hash, writeContract, isPending, error } = useWriteContract();

  const vote = (vaultAddress: Address, proposalId: number, inFavor: boolean) => {
    return writeContract({
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
      refetchInterval: 3000, // Refetch cada 3 segundos para ver cambios de balance
    },
  });
}

/**
 * Obtener saldo disponible de una Coperacha (descontando fondos reservados)
 */
export function useCoperachaAvailableBalance(vaultAddress?: Address) {
  return useReadContract({
    address: vaultAddress,
    abi: CoperachaWalletABI,
    functionName: 'getAvailableBalance',
    query: {
      enabled: !!vaultAddress,
      refetchInterval: 3000,
    },
  });
}

/**
 * Obtener fondos reservados de una Coperacha
 */
export function useCoperachaReservedFunds(vaultAddress?: Address) {
  return useReadContract({
    address: vaultAddress,
    abi: CoperachaWalletABI,
    functionName: 'reservedFunds',
    query: {
      enabled: !!vaultAddress,
      refetchInterval: 3000,
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

/**
 * Obtener eventos/historial de una Coperacha
 */
export interface CoperachaEvent {
  id: string;
  type: 'deposit' | 'proposalCreated' | 'vote' | 'proposalExecuted' | 'proposalRejected' | 'withdrawal' | 'memberAdded';
  timestamp: Date;
  blockNumber: bigint;
  transactionHash: string;
  logIndex: number;
  transactionIndex: number;
  data: {
    depositor?: Address;
    amount?: bigint;
    proposalId?: bigint;
    proposalType?: number;
    proposer?: Address;
    voter?: Address;
    inFavor?: boolean;
    recipient?: Address;
    newMember?: Address;
  };
}

export function useCoperachaEvents(vaultAddress?: Address) {
  const [events, setEvents] = useState<CoperachaEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refetchTrigger, setRefetchTrigger] = useState(0);
  const publicClient = usePublicClient();

  const refetch = () => {
    setRefetchTrigger(prev => prev + 1);
  };

  useEffect(() => {
    if (!vaultAddress || !publicClient) {
      setIsLoading(false);
      return;
    }

    let isCancelled = false;

    const fetchEvents = async () => {
      if (isCancelled) return;
      setIsLoading(true);
      try {
        const currentBlock = await publicClient.getBlockNumber();
        // Calcular fromBlock sin permitir números negativos
        const fromBlock = currentBlock > 10000n ? currentBlock - 10000n : 0n;

        // Obtener todos los eventos
        const [deposits, proposalsCreated, votes, proposalsExecuted, proposalsRejected, withdrawals, membersAdded] = await Promise.all([
          publicClient.getContractEvents({
            address: vaultAddress,
            abi: CoperachaWalletABI,
            eventName: 'DepositMade',
            fromBlock,
            toBlock: 'latest',
          }),
          publicClient.getContractEvents({
            address: vaultAddress,
            abi: CoperachaWalletABI,
            eventName: 'ProposalCreated',
            fromBlock,
            toBlock: 'latest',
          }),
          publicClient.getContractEvents({
            address: vaultAddress,
            abi: CoperachaWalletABI,
            eventName: 'VoteCasted',
            fromBlock,
            toBlock: 'latest',
          }),
          publicClient.getContractEvents({
            address: vaultAddress,
            abi: CoperachaWalletABI,
            eventName: 'ProposalExecuted',
            fromBlock,
            toBlock: 'latest',
          }),
          publicClient.getContractEvents({
            address: vaultAddress,
            abi: CoperachaWalletABI,
            eventName: 'ProposalRejected',
            fromBlock,
            toBlock: 'latest',
          }),
          publicClient.getContractEvents({
            address: vaultAddress,
            abi: CoperachaWalletABI,
            eventName: 'WithdrawalExecuted',
            fromBlock,
            toBlock: 'latest',
          }),
          publicClient.getContractEvents({
            address: vaultAddress,
            abi: CoperachaWalletABI,
            eventName: 'MemberAdded',
            fromBlock,
            toBlock: 'latest',
          }),
        ]);

        // Recolectar todos los eventos y obtener bloques únicos
        const allEventsRaw = [
          ...deposits.map(e => ({ ...e, type: 'deposit' as const })),
          ...proposalsCreated.map(e => ({ ...e, type: 'proposalCreated' as const })),
          ...votes.map(e => ({ ...e, type: 'vote' as const })),
          ...proposalsExecuted.map(e => ({ ...e, type: 'proposalExecuted' as const })),
          ...proposalsRejected.map(e => ({ ...e, type: 'proposalRejected' as const })),
          ...withdrawals.map(e => ({ ...e, type: 'withdrawal' as const })),
          ...membersAdded.map(e => ({ ...e, type: 'memberAdded' as const })),
        ];

        // Obtener bloques únicos en lote
        const uniqueBlockNumbers = [...new Set(allEventsRaw.map(e => e.blockNumber))];
        const blockCache = new Map<bigint, bigint>();
        
        await Promise.all(
          uniqueBlockNumbers.map(async (blockNum) => {
            const block = await publicClient.getBlock({ blockNumber: blockNum });
            blockCache.set(blockNum, block.timestamp);
          })
        );

        // Procesar eventos usando el cache de bloques
        const allEvents: CoperachaEvent[] = allEventsRaw.map(event => {
          const timestamp = blockCache.get(event.blockNumber) || 0n;
          
          const baseEvent = {
            id: `${event.transactionHash}-${event.logIndex}`,
            timestamp: new Date(Number(timestamp) * 1000),
            blockNumber: event.blockNumber,
            transactionHash: event.transactionHash,
            logIndex: event.logIndex,
            transactionIndex: event.transactionIndex,
            type: event.type,
          };

          switch (event.type) {
            case 'deposit':
              return {
                ...baseEvent,
                data: {
                  depositor: event.args.depositor,
                  amount: event.args.amount,
                },
              };
            case 'proposalCreated':
              return {
                ...baseEvent,
                data: {
                  proposalId: event.args.proposalId,
                  proposalType: Number(event.args.proposalType),
                  proposer: event.args.proposer,
                },
              };
            case 'vote':
              return {
                ...baseEvent,
                data: {
                  proposalId: event.args.proposalId,
                  voter: event.args.voter,
                  inFavor: event.args.inFavor,
                },
              };
            case 'proposalExecuted':
              return {
                ...baseEvent,
                data: {
                  proposalId: event.args.proposalId,
                },
              };
            case 'proposalRejected':
              return {
                ...baseEvent,
                data: {
                  proposalId: event.args.proposalId,
                },
              };
            case 'withdrawal':
              return {
                ...baseEvent,
                data: {
                  recipient: event.args.recipient,
                  amount: event.args.amount,
                },
              };
            case 'memberAdded':
              return {
                ...baseEvent,
                data: {
                  newMember: event.args.newMember,
                },
              };
            default:
              return baseEvent as CoperachaEvent;
          }
        });

        // Ordenar eventos correctamente:
        // 1. Por timestamp (más recientes primero)
        // 2. Si mismo timestamp, por blockNumber (bloques más recientes primero)
        // 3. Si mismo bloque, por transactionIndex (transacciones en orden)
        // 4. Si misma transacción, por logIndex (eventos en orden)
        allEvents.sort((a, b) => {
          // Primero por timestamp
          const timeDiff = b.timestamp.getTime() - a.timestamp.getTime();
          if (timeDiff !== 0) return timeDiff;
          
          // Si mismo timestamp, por blockNumber
          const blockDiff = Number(b.blockNumber - a.blockNumber);
          if (blockDiff !== 0) return blockDiff;
          
          // Si mismo bloque, por transactionIndex
          const txDiff = b.transactionIndex - a.transactionIndex;
          if (txDiff !== 0) return txDiff;
          
          // Si misma transacción, por logIndex (orden en que ocurrieron)
          return b.logIndex - a.logIndex;
        });

        if (!isCancelled) {
          setEvents(allEvents);
        }
      } catch (error) {
        if (!isCancelled) {
          console.error('Error fetching events:', error);
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchEvents();

    return () => {
      isCancelled = true;
    };
  }, [vaultAddress, publicClient, refetchTrigger]);

  return { events, isLoading, refetch };
}
