import { useState } from "react";
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
} from "lucide-react";
import { ProposalList } from "./ProposalList";
import { CreateProposalDialog } from "./CreateProposalDialog";
import { DepositDialog } from "./DepositDialog";
import { Address, formatEther } from "viem";
import { useAccount } from "wagmi";
import {
  useCoperachaInfo,
  useCoperachaBalance,
  useCoperachaMembers,
} from "../hooks/useCoperacha";
import { useEthPrice, formatEthToUSD } from "../hooks/useEthPrice";

interface WalletDetailProps {
  vaultAddress: Address;
  onBack: () => void;
}

export function WalletDetail({ vaultAddress, onBack }: WalletDetailProps) {
  const [activeTab, setActiveTab] = useState("proposals");
  const { address: userAddress } = useAccount();
  const ethPrice = useEthPrice();

  // Obtener datos del contrato
  const { data: vaultInfo, isLoading: isLoadingInfo } =
    useCoperachaInfo(vaultAddress);
  const { data: balance, isLoading: isLoadingBalance } =
    useCoperachaBalance(vaultAddress);
  const { data: members, isLoading: isLoadingMembers } =
    useCoperachaMembers(vaultAddress);

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
  const memberList = members || [];
  const proposalCount = Number(proposalCounter);
  const requiredVotes = Math.ceil(memberList.length / 2);

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

  // TODO: Obtener propuestas activas para el contador
  const activeProposalsCount = 0;

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
            <p className="text-sm text-gray-500 font-mono mt-2">
              {vaultAddress}
            </p>
          </div>
          <div className="flex gap-3">
            <DepositDialog vaultAddress={vaultAddress} />
            <CreateProposalDialog
              vaultAddress={vaultAddress}
              members={formattedMembers}
            />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <Card className="relative border-0 bg-white/80 backdrop-blur-xl shadow-xl rounded-3xl overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-gray-600 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Balance Total
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  ${formatEthToUSD(balanceInEth, ethPrice)}
                </p>
                <p className="text-sm font-semibold text-gray-500 mt-1">
                  {parseFloat(balanceInEth).toFixed(4)} ETH disponibles
                </p>
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
                  Propuestas Activas
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
          {/* TODO: Obtener eventos del blockchain */}
          <div className="text-center py-20">
            <p className="text-xl font-bold text-gray-700 mb-2">
              Historial de Transacciones
            </p>
            <p className="font-semibold text-gray-500">
              En construcción - Historial de depósitos y retiros
            </p>
          </div>
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
                        <p className="text-lg font-bold text-gray-900">
                          {member.name}
                        </p>
                        <p className="text-sm font-semibold text-gray-500 font-mono">
                          {member.address}
                        </p>
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
