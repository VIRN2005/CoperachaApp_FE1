import { useState, useEffect } from "react";
import { Address, formatEther } from "viem";
import { useAccount } from "wagmi";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { CopyableAddress } from "./CopyableAddress";
import {
  ThumbsUp,
  ThumbsDown,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  Sparkles,
  UserPlus,
  TrendingDown,
} from "lucide-react";
import {
  useProposalInfo,
  useHasVoted,
  useVoteOnProposal,
} from "../hooks/useCoperacha";
import { ProposalStatus } from "../contracts/addresses";
import { toast } from "sonner";
import { useEthPrice, formatEthToUSD } from "../hooks/useEthPrice";

export type ProposalFilter = "all" | "pending" | "executed" | "rejected";

interface ProposalListProps {
  vaultAddress: Address;
  proposalCount: number;
  requiredVotes: number;
  totalMembers?: number;
  onProposalExecuted?: () => void;
}

interface ProposalData {
  id: number;
  proposalType: number;
  proposer: Address;
  description: string;
  recipient: Address;
  amount: bigint;
  votesFor: bigint;
  votesAgainst: bigint;
  status: number;
}

function ProposalItem({
  vaultAddress,
  proposalId,
  requiredVotes,
  totalMembers = requiredVotes,
  filter,
  onProposalExecuted,
}: {
  vaultAddress: Address;
  proposalId: number;
  requiredVotes: number;
  totalMembers?: number;
  filter: ProposalFilter;
  onProposalExecuted?: () => void;
}) {
  const { address: userAddress } = useAccount();
  const ethPrice = useEthPrice();
  const [hasVotedOptimistic, setHasVotedOptimistic] = useState(false);
  const {
    data: proposalData,
    isLoading,
    refetch: refetchProposal,
  } = useProposalInfo(vaultAddress, proposalId);
  const { data: hasVoted, refetch: refetchHasVoted } = useHasVoted(
    vaultAddress,
    proposalId,
    userAddress
  );
  const { vote, isPending, isConfirming, isSuccess, error } =
    useVoteOnProposal();
  const isVoting = isPending || isConfirming;

  // Track previous status to detect when proposal gets executed
  const [prevStatus, setPrevStatus] = useState<number | null>(null);

  // Usar el estado optimista si está disponible, sino usar los datos del blockchain
  const userHasVoted = hasVotedOptimistic || hasVoted;

  // Manejar estados de votación
  useEffect(() => {
    if (isPending) {
      toast.loading("Confirma el voto en tu wallet...", {
        id: `vote-${proposalId}`,
      });
    } else if (isConfirming) {
      toast.loading("Registrando tu voto...", {
        id: `vote-${proposalId}`,
        description: "Esperando confirmación en el blockchain",
      });
    } else if (isSuccess) {
      toast.success("¡Voto registrado!", {
        id: `vote-${proposalId}`,
        description: "Tu voto ha sido contabilizado",
      });
      setHasVotedOptimistic(true); // Actualizar inmediatamente la UI
      refetchProposal(); // Refrescar datos en background
      refetchHasVoted(); // Refrescar confirmación en background
    }
  }, [
    isPending,
    isConfirming,
    isSuccess,
    proposalId,
    refetchProposal,
    refetchHasVoted,
  ]);

  // Manejar errores por separado
  useEffect(() => {
    if (error) {
      toast.dismiss(`vote-${proposalId}`);

      const errorMessage = error.message || String(error);
      if (
        errorMessage.includes("User rejected") ||
        errorMessage.includes("user rejected")
      ) {
        toast.error("Voto cancelado", {
          description: "Rechazaste la transacción en tu wallet",
        });
      } else {
        toast.error("Error al votar", {
          description: "Ocurrió un error. Por favor intenta de nuevo.",
        });
      }
    }
  }, [error, proposalId]);

  // Detect when proposal gets executed and trigger callback
  useEffect(() => {
    if (proposalData) {
      const currentStatus = proposalData[9]; // status is at index 9
      const currentType = proposalData[1]; // proposalType is at index 1

      // If proposal just got executed (changed from PENDING to EXECUTED)
      if (
        prevStatus === ProposalStatus.PENDING &&
        currentStatus === ProposalStatus.EXECUTED &&
        currentType === 1 && // ADD_MEMBER type
        onProposalExecuted
      ) {
        // Call the callback to refresh wallet data (members list, etc.)
        onProposalExecuted();
      }

      setPrevStatus(currentStatus);
    }
  }, [proposalData, prevStatus, onProposalExecuted]);

  if (isLoading || !proposalData) {
    return (
      <Card className="border-0 bg-white/80 backdrop-blur-xl shadow-lg rounded-3xl">
        <CardContent className="p-8">
          <div className="flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const [
    id,
    proposalType,
    proposer,
    description,
    recipient,
    amount,
    newMember,
    votesFor,
    votesAgainst,
    status,
  ] = proposalData;

  const amountInEth = formatEther(amount);
  const votesForNum = Number(votesFor);
  const isActive = status === ProposalStatus.PENDING;
  const isApproved = status === ProposalStatus.EXECUTED;
  const isRejected = status === ProposalStatus.REJECTED;
  const progress = (votesForNum / requiredVotes) * 100;

  // Aplicar filtro
  const shouldShow =
    filter === "all" ||
    (filter === "pending" && isActive) ||
    (filter === "executed" && isApproved) ||
    (filter === "rejected" && isRejected);

  if (!shouldShow) {
    return null;
  }

  const handleVote = (inFavor: boolean) => {
    vote(vaultAddress, Number(id), inFavor);
  };

  return (
    <div className="relative group">
      {isApproved && (
        <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-3xl blur-xl opacity-30"></div>
      )}
      {isActive && (
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
      )}

      <Card
        className={`relative border-0 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all rounded-3xl overflow-hidden ${
          isApproved
            ? "bg-gradient-to-br from-green-50/80 to-emerald-50/80"
            : "bg-white/80"
        }`}
      >
        {isApproved && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 to-emerald-500"></div>
        )}
        {isActive && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-cyan-500 animate-pulse"></div>
        )}

        <CardContent className="p-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h3 className="text-xl font-bold text-gray-900">
                  Propuesta #{Number(id)}
                </h3>
                {proposalType === 0 && (
                  <Badge className="bg-gradient-to-r from-blue-400 to-blue-600 text-white border-0 shadow-lg px-3 py-1 flex items-center gap-1">
                    <TrendingDown className="w-3 h-3" />
                    Retiro
                  </Badge>
                )}
                {proposalType === 1 && (
                  <Badge className="bg-gradient-to-r from-purple-400 to-pink-600 text-white border-0 shadow-lg px-3 py-1 flex items-center gap-1">
                    <UserPlus className="w-3 h-3" />
                    Nuevo Miembro
                  </Badge>
                )}
                {isApproved && (
                  <Badge className="bg-gradient-to-r from-green-400 to-emerald-500 text-white border-0 shadow-lg px-3 py-1">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Ejecutada
                  </Badge>
                )}
                {isRejected && (
                  <Badge className="bg-gradient-to-r from-red-400 to-red-500 text-white border-0 shadow-lg px-3 py-1">
                    <XCircle className="w-4 h-4 mr-1" />
                    Rechazada
                  </Badge>
                )}
                {isActive && (
                  <Badge className="bg-gradient-to-r from-blue-400 to-cyan-500 text-white border-0 shadow-lg px-3 py-1 animate-pulse">
                    <Clock className="w-4 h-4 mr-1" />
                    Activa
                  </Badge>
                )}
              </div>
              <p className="text-gray-600 mb-4">{description}</p>

              {/* Details - Different by proposal type */}
              <div className="flex flex-wrap items-center gap-4">
                {proposalType === 0 ? (
                  // Propuesta de retiro
                  <>
                    <div className="px-4 py-2 bg-white/60 backdrop-blur-sm rounded-xl border border-white/50">
                      <span className="text-sm text-gray-500">Monto: </span>
                      <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                        ${formatEthToUSD(amountInEth, ethPrice)}
                      </span>
                      <span className="text-xs text-gray-400 ml-2">
                        ({parseFloat(amountInEth).toFixed(4)} ETH)
                      </span>
                    </div>
                    <div className="px-4 py-2 bg-white/60 backdrop-blur-sm rounded-xl border border-white/50 flex items-center gap-1">
                      <span className="text-sm text-gray-500">
                        Destinatario:{" "}
                      </span>
                      <CopyableAddress
                        address={recipient}
                        showFull={false}
                        className="text-gray-900 text-sm"
                      />
                    </div>
                  </>
                ) : (
                  // Propuesta de nuevo miembro
                  <div className="px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 backdrop-blur-sm rounded-xl border border-purple-200 flex items-center gap-2">
                    <UserPlus className="w-4 h-4 text-purple-600" />
                    <span className="text-sm text-gray-600">
                      Nuevo miembro:{" "}
                      <CopyableAddress
                        address={newMember}
                        showFull={false}
                        className="text-purple-700 font-semibold"
                      />
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Voting Progress */}
          <div className="mb-6 p-5 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/50">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-600 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-500" />
                Progreso de votación
              </span>
              <span className="text-lg text-gray-900 flex items-center gap-2">
                {votesForNum} / {requiredVotes} votos
              </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden shadow-inner">
              <div
                className={`h-3 rounded-full transition-all shadow-lg ${
                  isApproved
                    ? "bg-gradient-to-r from-green-400 to-emerald-500"
                    : "bg-gradient-to-r from-blue-500 to-cyan-500"
                }`}
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>

            {/* Vote indicators - Show progress relative to total members */}
            <div className="flex gap-2 mt-3">
              {Array.from({ length: totalMembers }).map((_, i) => {
                const votesAgainstNum = Number(votesAgainst);
                const isFor = i < votesForNum;
                const isAgainst =
                  i >= votesForNum && i < votesForNum + votesAgainstNum;

                return (
                  <div
                    key={i}
                    className={`flex-1 h-2 rounded-full transition-all ${
                      isFor
                        ? isApproved
                          ? "bg-gradient-to-r from-green-400 to-emerald-500 shadow-lg"
                          : "bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg"
                        : isAgainst
                        ? "shadow-lg"
                        : "bg-gray-200"
                    }`}
                    style={
                      isAgainst ? { backgroundColor: "#ef4444" } : undefined
                    }
                  />
                );
              })}
            </div>
          </div>

          {/* Voting Buttons */}
          {isActive && (
            <div className="flex gap-4">
              {!userHasVoted ? (
                <>
                  <Button
                    onClick={() => handleVote(true)}
                    disabled={isVoting}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white gap-2 py-6 rounded-xl shadow-xl shadow-green-500/30 hover:shadow-2xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isVoting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Votando...</span>
                      </>
                    ) : (
                      <>
                        <ThumbsUp className="w-5 h-5" />
                        <span>Votar a favor</span>
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={() => handleVote(false)}
                    disabled={isVoting}
                    className="flex-1 bg-white hover:bg-gray-50 text-gray-900 gap-2 py-6 rounded-xl border-2 border-gray-200 shadow-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isVoting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Votando...</span>
                      </>
                    ) : (
                      <>
                        <ThumbsDown className="w-5 h-5" />
                        <span>Votar en contra</span>
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <div className="flex-1 p-5 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-200">
                  <p className="text-center text-blue-700 font-semibold">
                    ✓ Ya has votado en esta propuesta
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export function ProposalList({
  vaultAddress,
  proposalCount,
  requiredVotes,
  totalMembers,
  onProposalExecuted,
}: ProposalListProps) {
  const [filter, setFilter] = useState<ProposalFilter>("pending");

  if (proposalCount === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-emerald-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <Sparkles className="w-10 h-10 text-blue-400" />
        </div>
        <p className="text-xl font-bold text-gray-700 mb-2">
          No hay propuestas aún
        </p>
        <p className="font-semibold text-gray-500">
          Crea la primera propuesta usando el botón "Nueva Propuesta"
        </p>
      </div>
    );
  }

  const proposals = Array.from({ length: proposalCount }, (_, i) => i).map(
    (proposalId) => (
      <ProposalItem
        key={proposalId}
        vaultAddress={vaultAddress}
        proposalId={proposalId}
        requiredVotes={requiredVotes}
        totalMembers={totalMembers}
        filter={filter}
        onProposalExecuted={onProposalExecuted}
      />
    )
  );

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <div className="flex gap-2 p-1 bg-gray-100 rounded-xl w-fit">
        <Button
          variant={filter === "all" ? "default" : "ghost"}
          size="sm"
          onClick={() => setFilter("all")}
          className={`rounded-lg ${
            filter === "all"
              ? "bg-gradient-to-r from-blue-600 to-emerald-600 text-white"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Todas
        </Button>
        <Button
          variant={filter === "pending" ? "default" : "ghost"}
          size="sm"
          onClick={() => setFilter("pending")}
          className={`rounded-lg ${
            filter === "pending"
              ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <Clock className="w-4 h-4 mr-1" />
          Activas
        </Button>
        <Button
          variant={filter === "executed" ? "default" : "ghost"}
          size="sm"
          onClick={() => setFilter("executed")}
          className={`rounded-lg ${
            filter === "executed"
              ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <CheckCircle className="w-4 h-4 mr-1" />
          Ejecutadas
        </Button>
        <Button
          variant={filter === "rejected" ? "default" : "ghost"}
          size="sm"
          onClick={() => setFilter("rejected")}
          className={`rounded-lg ${
            filter === "rejected"
              ? "bg-gradient-to-r from-red-600 to-pink-600 text-white"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <XCircle className="w-4 h-4 mr-1" />
          Rechazadas
        </Button>
      </div>

      {/* Lista de propuestas */}
      {proposals}
    </div>
  );
}
