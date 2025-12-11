import { useState, useCallback, useRef } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  ArrowLeft,
  Users,
  TrendingUp,
  Sparkles,
  Activity,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { ProposalList } from "./ProposalList";
import { CreateProposalDialog } from "./CreateProposalDialog";
import { DepositDialog } from "./DepositDialog";
import { CopyableAddress } from "./CopyableAddress";
import { Address, formatEther } from "viem";
import { useAccount } from "wagmi";
import {
  useCoperachaInfo,
  useCoperachaBalance,
  useCoperachaAvailableBalance,
  useCoperachaReservedFunds,
  useCoperachaMembers,
  useCoperachaEvents,
} from "../hooks/useCoperacha";
import { useEthPrice, formatEthToUSD } from "../hooks/useEthPrice";
import { getTransactionUrl, getBlockExplorer } from "../contracts/addresses";

interface WalletDetailProps {
  vaultAddress: Address;
  onBack: () => void;
}

export function WalletDetail({ vaultAddress, onBack }: WalletDetailProps) {
  const [activeTab, setActiveTab] = useState("proposals");
  const { address: userAddress, chain } = useAccount();
  const ethPrice = useEthPrice();

  // Obtener explorador de bloques de la red actual
  const blockExplorer = chain?.id
    ? getBlockExplorer(chain.id)
    : { name: "Explorer", url: "#" };

  // Obtener datos del contrato
  const {
    data: vaultInfo,
    isLoading: isLoadingInfo,
    refetch: refetchInfo,
  } = useCoperachaInfo(vaultAddress);
  const {
    data: balance,
    isLoading: isLoadingBalance,
    refetch: refetchBalance,
  } = useCoperachaBalance(vaultAddress);
  const { data: availableBalance, refetch: refetchAvailableBalance } =
    useCoperachaAvailableBalance(vaultAddress);
  const { data: reservedFunds, refetch: refetchReservedFunds } =
    useCoperachaReservedFunds(vaultAddress);
  const { data: members, isLoading: isLoadingMembers } =
    useCoperachaMembers(vaultAddress);
  const {
    events,
    isLoading: isLoadingEvents,
    refetch: refetchEvents,
  } = useCoperachaEvents(vaultAddress);

  // Debounce para evitar llamadas múltiples
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isRefreshingRef = useRef(false);

  // Función para refrescar todos los datos con debounce
  const refreshData = useCallback(() => {
    if (isRefreshingRef.current) {
      return;
    }

    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }

    refreshTimeoutRef.current = setTimeout(() => {
      isRefreshingRef.current = true;

      refetchInfo();
      refetchBalance();
      refetchAvailableBalance();
      refetchReservedFunds();
      refetchEvents();

      // Reset flag after a delay
      setTimeout(() => {
        isRefreshingRef.current = false;
      }, 2000);
    }, 1000); // Aumentado a 1 segundo para mayor estabilidad
  }, [
    refetchInfo,
    refetchBalance,
    refetchAvailableBalance,
    refetchReservedFunds,
    refetchEvents,
  ]);

  // Loading state
  if (isLoadingInfo || isLoadingBalance || isLoadingMembers) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Cargando detalles de la Coperacha...</p>
        </div>
      </div>
    );
  }

  if (!vaultInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">
            Error cargando información de la Coperacha
          </p>
          <Button onClick={onBack} className="mt-4">
            Volver al Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const [name, , , proposalCounter] = vaultInfo;
  const balanceInEth = balance ? formatEther(balance) : "0";
  const availableBalanceInEth = availableBalance
    ? formatEther(availableBalance)
    : "0";
  const reservedFundsInEth = reservedFunds ? formatEther(reservedFunds) : "0";
  const memberList = members || [];
  const proposalCount = Number(proposalCounter);
  const requiredVotes = Math.floor(memberList.length / 2) + 1;

  // Convertir miembros a formato para CreateProposalDialog
  const formattedMembers = memberList.map((addr, idx) => ({
    address: addr,
    name: `Miembro ${idx + 1}`,
    avatar: [
      "from-purple-400 to-purple-600",
      "from-green-400 to-green-600",
      "from-orange-400 to-orange-600",
      "from-blue-400 to-blue-600",
      "from-pink-400 to-pink-600",
    ][idx % 5],
  }));

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={onBack}
        className="mb-6 gap-2 hover:bg-white/60 rounded-xl px-4 py-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver
      </Button>

      {/* Wallet Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent mb-2">
              {name}
            </h1>
            <CopyableAddress
              address={vaultAddress}
              showFull={true}
              className="text-gray-500 mt-2"
            />
          </div>
          <div className="flex gap-3">
            <DepositDialog
              vaultAddress={vaultAddress}
              onSuccess={refreshData}
            />
            <CreateProposalDialog
              vaultAddress={vaultAddress}
              members={formattedMembers}
              onSuccess={refreshData}
            />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <Card className="relative border-0 bg-white/80 backdrop-blur-xl shadow-xl rounded-3xl overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-gray-600 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Balance Disponible
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-0">
                <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent leading-tight">
                  ${formatEthToUSD(balanceInEth, ethPrice)}
                </p>
                <p className="text-sm font-semibold text-gray-500 mt-0.5">
                  {parseFloat(balanceInEth).toFixed(4)} ETH total
                </p>
                <div className="mt-1.5 pt-1.5 border-t border-gray-200 space-y-0.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-500">Disponible:</span>
                    <span className="font-semibold text-green-500">
                      ${formatEthToUSD(availableBalanceInEth, ethPrice)} (
                      {parseFloat(availableBalanceInEth).toFixed(4)} ETH)
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-500">Reservado:</span>
                    <span className="font-semibold text-red-600">
                      ${formatEthToUSD(reservedFundsInEth, ethPrice)} (
                      {parseFloat(reservedFundsInEth).toFixed(4)} ETH)
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <Card className="relative border-0 bg-white/80 backdrop-blur-xl shadow-xl rounded-3xl overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-teal-500"></div>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-gray-600 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Miembros
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 mb-3">
                  {formattedMembers.slice(0, 5).map((member, idx) => (
                    <div
                      key={idx}
                      className={`w-10 h-10 bg-gradient-to-br ${member.avatar} rounded-full border-3 border-white shadow-lg -ml-2 first:ml-0 hover:scale-110 transition-transform`}
                      title={member.address}
                    />
                  ))}
                  {formattedMembers.length > 5 && (
                    <span className="text-sm text-gray-600 ml-1">
                      +{formattedMembers.length - 5}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500">
                  {formattedMembers.length} participantes activos
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <Card className="relative border-0 bg-white/80 backdrop-blur-xl shadow-xl rounded-3xl overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 to-emerald-500"></div>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-gray-600 flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  Propuestas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                  {proposalCount}
                </p>
                <p className="text-sm font-semibold text-gray-500 mt-1">
                  Total de propuestas
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6 bg-white/60 backdrop-blur-sm border border-white/50 p-1 rounded-2xl shadow-lg">
          <TabsTrigger
            value="proposals"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-emerald-600 data-[state=active]:text-white rounded-xl px-6 py-3 transition-all"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Propuestas {proposalCount > 0 && `(${proposalCount})`}
          </TabsTrigger>
          <TabsTrigger
            value="history"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-emerald-600 data-[state=active]:text-white rounded-xl px-6 py-3 transition-all"
          >
            <Activity className="w-4 h-4 mr-2" />
            Historial
          </TabsTrigger>
          <TabsTrigger
            value="members"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-emerald-600 data-[state=active]:text-white rounded-xl px-6 py-3 transition-all"
          >
            <Users className="w-4 h-4 mr-2" />
            Miembros
          </TabsTrigger>
        </TabsList>

        <TabsContent value="proposals" className="space-y-6">
          <ProposalList
            vaultAddress={vaultAddress}
            proposalCount={proposalCount}
            requiredVotes={requiredVotes}
          />
        </TabsContent>

        <TabsContent value="history">
          <div className="mb-4 flex justify-end">
            <Button
              onClick={refetchEvents}
              disabled={isLoadingEvents}
              variant="outline"
              className="gap-2 border-gray-300 rounded-xl hover:bg-gray-50"
            >
              <RefreshCw
                className={`w-4 h-4 ${isLoadingEvents ? "animate-spin" : ""}`}
              />
              Actualizar
            </Button>
          </div>
          {isLoadingEvents ? (
            <div className="text-center py-20">
              <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600">Cargando historial...</p>
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-20">
              <Activity className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-xl font-bold text-gray-700 mb-2">
                Sin actividad aún
              </p>
              <p className="font-semibold text-gray-500">
                Los eventos aparecerán aquí cuando haya actividad
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {events.map((event) => {
                const getEventIcon = () => {
                  switch (event.type) {
                    case "deposit":
                      return "💰";
                    case "proposalCreated":
                      return "📝";
                    case "vote":
                      return event.data.inFavor ? "✅" : "❌";
                    case "proposalExecuted":
                      return "✔️";
                    case "proposalRejected":
                      return "🚫";
                    case "withdrawal":
                      return "💸";
                    case "memberAdded":
                      return "👤";
                    default:
                      return "📌";
                  }
                };

                const getEventTitle = () => {
                  switch (event.type) {
                    case "deposit":
                      return "Depósito realizado";
                    case "proposalCreated":
                      return event.data.proposalType === 0
                        ? "Propuesta de retiro creada"
                        : "Propuesta para agregar miembro";
                    case "vote":
                      return event.data.inFavor
                        ? "Voto a favor"
                        : "Voto en contra";
                    case "proposalExecuted":
                      return "Propuesta ejecutada";
                    case "proposalRejected":
                      return "Propuesta rechazada";
                    case "withdrawal":
                      return "Retiro ejecutado";
                    case "memberAdded":
                      return "Nuevo miembro agregado";
                    default:
                      return "Evento";
                  }
                };

                const getEventDescription = () => {
                  const ethAmount = formatEther(event.data.amount || 0n);
                  const usdAmount = formatEthToUSD(ethAmount, ethPrice);

                  switch (event.type) {
                    case "deposit":
                      return (
                        <span className="inline-flex items-center gap-1 flex-wrap">
                          <CopyableAddress
                            address={event.data.depositor!}
                            className="text-gray-600"
                          />
                          <span>
                            depositó {ethAmount} ETH (${usdAmount})
                          </span>
                        </span>
                      );
                    case "proposalCreated":
                      return (
                        <span className="inline-flex items-center gap-1 flex-wrap">
                          <span>
                            Propuesta #{event.data.proposalId?.toString()}{" "}
                            creada por
                          </span>
                          <CopyableAddress
                            address={event.data.proposer!}
                            className="text-gray-600"
                          />
                        </span>
                      );
                    case "vote":
                      return (
                        <span className="inline-flex items-center gap-1 flex-wrap">
                          <CopyableAddress
                            address={event.data.voter!}
                            className="text-gray-600"
                          />
                          <span>
                            votó en propuesta #
                            {event.data.proposalId?.toString()}
                          </span>
                        </span>
                      );
                    case "proposalExecuted":
                      return `Propuesta #${event.data.proposalId?.toString()} aprobada y ejecutada`;
                    case "proposalRejected":
                      return `Propuesta #${event.data.proposalId?.toString()} fue rechazada`;
                    case "withdrawal":
                      return (
                        <span className="inline-flex items-center gap-1 flex-wrap">
                          <span>
                            {ethAmount} ETH (${usdAmount}) enviados a
                          </span>
                          <CopyableAddress
                            address={event.data.recipient!}
                            className="text-gray-600"
                          />
                        </span>
                      );
                    case "memberAdded":
                      return (
                        <span className="inline-flex items-center gap-1 flex-wrap">
                          <CopyableAddress
                            address={event.data.newMember!}
                            className="text-gray-600"
                          />
                          <span>fue agregado como miembro</span>
                        </span>
                      );
                    default:
                      return "Evento del contrato";
                  }
                };

                const getEventColor = () => {
                  switch (event.type) {
                    case "deposit":
                      return "from-green-500 to-emerald-500";
                    case "withdrawal":
                      return "from-red-500 to-pink-500";
                    case "proposalCreated":
                      return "from-blue-500 to-cyan-500";
                    case "vote":
                      return event.data.inFavor
                        ? "from-green-500 to-teal-500"
                        : "from-orange-500 to-red-500";
                    case "proposalExecuted":
                      return "from-purple-500 to-pink-500";
                    case "proposalRejected":
                      return "from-gray-500 to-gray-600";
                    case "memberAdded":
                      return "from-indigo-500 to-purple-500";
                    default:
                      return "from-gray-400 to-gray-500";
                  }
                };

                return (
                  <div key={event.id} className="relative group">
                    <div
                      className={`absolute inset-0 bg-gradient-to-r ${getEventColor()} rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity`}
                    ></div>
                    <Card className="relative border-0 bg-white/80 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all rounded-2xl">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div
                            className={`w-12 h-12 bg-gradient-to-br ${getEventColor()} rounded-xl shadow-lg flex items-center justify-center text-2xl flex-shrink-0`}
                          >
                            {getEventIcon()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-lg font-bold text-gray-900 mb-1">
                              {getEventTitle()}
                            </p>
                            <div className="text-sm text-gray-600 mb-2 break-words">
                              {getEventDescription()}
                            </div>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span>
                                {event.timestamp.toLocaleDateString("es-ES", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                              {chain?.id &&
                                getTransactionUrl(
                                  chain.id,
                                  event.transactionHash
                                ) !== "#" && (
                                  <a
                                    href={getTransactionUrl(
                                      chain.id,
                                      event.transactionHash
                                    )}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800 hover:underline"
                                  >
                                    Ver en {blockExplorer.name} ↗
                                  </a>
                                )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="members">
          <div className="grid gap-4">
            {formattedMembers.map((member) => (
              <div key={member.address} className="relative group">
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${member.avatar} rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity`}
                ></div>
                <Card className="relative border-0 bg-white/80 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all rounded-2xl">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-16 h-16 bg-gradient-to-br ${member.avatar} rounded-2xl shadow-lg flex items-center justify-center text-white font-bold text-2xl`}
                      >
                        #
                      </div>
                      <div className="flex-1">
                        <p className="text-lg font-bold text-gray-900 mb-1">
                          {member.name}
                        </p>
                        <CopyableAddress
                          address={member.address}
                          showFull={false}
                          className="text-gray-500"
                        />
                      </div>
                      {member.address === userAddress && (
                        <span className="px-4 py-2 bg-gradient-to-r from-blue-500 to-emerald-500 text-white rounded-xl text-sm shadow-lg">
                          Tú
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
