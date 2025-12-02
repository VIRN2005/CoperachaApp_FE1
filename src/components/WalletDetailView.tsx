import { Address, formatEther } from "viem";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { ArrowLeft, Users, TrendingUp, Loader2 } from "lucide-react";
import {
  useCoperachaInfo,
  useCoperachaBalance,
  useCoperachaMembers,
} from "../hooks/useCoperacha";

interface WalletDetailViewProps {
  vaultAddress: Address;
  onBack: () => void;
}

export function WalletDetailView({
  vaultAddress,
  onBack,
}: WalletDetailViewProps) {
  const { data: vaultInfo, isLoading: isLoadingInfo } =
    useCoperachaInfo(vaultAddress);
  const { data: balance, isLoading: isLoadingBalance } =
    useCoperachaBalance(vaultAddress);
  const { data: members, isLoading: isLoadingMembers } =
    useCoperachaMembers(vaultAddress);

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
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <TrendingUp className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Balance Total</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    {parseFloat(balanceInEth).toFixed(4)} ETH
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Users className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Miembros</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {memberList.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <TrendingUp className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Propuestas</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {proposalCounter.toString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Members Section */}
      <Card className="mb-8 border-0 shadow-xl bg-white/80 backdrop-blur-sm">
        <CardContent className="p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" />
            Miembros de la Coperacha
          </h2>
          <div className="space-y-3">
            {memberList.map((member, index) => {
              const colors = [
                "from-purple-400 to-purple-600",
                "from-green-400 to-green-600",
                "from-orange-400 to-orange-600",
                "from-blue-400 to-blue-600",
                "from-pink-400 to-pink-600",
              ];
              return (
                <div
                  key={member}
                  className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl"
                >
                  <div
                    className={`w-12 h-12 bg-gradient-to-br ${
                      colors[index % colors.length]
                    } rounded-full flex items-center justify-center text-white font-bold shadow-lg`}
                  >
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-mono text-sm text-gray-700">{member}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* TODO Section */}
      <Card className="border-2 border-dashed border-gray-300 bg-gray-50">
        <CardContent className="p-8 text-center">
          <p className="text-gray-600 mb-2">🚧 En construcción</p>
          <p className="text-sm text-gray-500">
            Próximamente: Depósitos, Propuestas y Votaciones
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
