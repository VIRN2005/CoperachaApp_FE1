import { Card, CardContent } from "./ui/card";
import {
  Users,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { Address, formatEther } from "viem";
import { useCoperachaInfo, useCoperachaBalance } from "../hooks/useCoperacha";

interface CommunityWalletsProps {
  vaultAddresses: readonly Address[];
  onSelectWallet: (address: string) => void;
}

function CoperachaCard({
  vaultAddress,
  onSelect,
  index,
}: {
  vaultAddress: Address;
  onSelect: () => void;
  index: number;
}) {
  const { data: vaultInfo } = useCoperachaInfo(vaultAddress);
  const { data: balance } = useCoperachaBalance(vaultAddress);

  const gradients = [
    "from-blue-500 to-cyan-500",
    "from-cyan-500 to-teal-500",
    "from-teal-500 to-emerald-500",
    "from-emerald-500 to-green-500",
    "from-blue-600 to-emerald-600",
  ];

  const gradient = gradients[index % gradients.length];

  if (!vaultInfo) {
    return (
      <Card className="p-6 bg-white/60 backdrop-blur-sm">
        <p className="text-gray-500">Cargando...</p>
      </Card>
    );
  }

  const [name, members, , proposalCounter] = vaultInfo;
  const balanceInEth = balance ? formatEther(balance) : "0";

  return (
    <div className="relative group">
      <div
        className={`absolute inset-0 bg-gradient-to-r ${gradient} rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity`}
      ></div>
      <Card
        className="relative border-0 bg-white/80 backdrop-blur-xl hover:bg-white/90 shadow-xl hover:shadow-2xl transition-all cursor-pointer group-hover:scale-[1.02] rounded-3xl overflow-hidden"
        onClick={onSelect}
      >
        <div
          className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient}`}
        ></div>

        <CardContent className="p-8">
          <div className="flex items-start justify-between">
            <div className="flex gap-5 flex-1">
              <div
                className={`w-16 h-16 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xl group-hover:scale-110 transition-transform`}
              >
                <Users className="w-8 h-8 text-white" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-gray-900">{name}</h3>
                  {Number(proposalCounter) > 0 && (
                    <div className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                      <Sparkles className="w-3 h-3" />
                      <span>
                        {proposalCounter.toString()} propuesta
                        {Number(proposalCounter) !== 1 ? "s" : ""}
                      </span>
                    </div>
                  )}
                </div>
                <p className="text-sm font-semibold text-gray-600 mb-6">
                  {members.length} miembro{members.length !== 1 ? "s" : ""}
                </p>

                <div className="grid grid-cols-3 gap-6">
                  <div className="p-4 bg-gradient-to-br from-white/60 to-white/40 backdrop-blur-sm rounded-2xl border border-white/50">
                    <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      Balance
                    </p>
                    <p
                      className={`text-xl bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}
                    >
                      {parseFloat(balanceInEth).toFixed(4)} ETH
                    </p>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-white/60 to-white/40 backdrop-blur-sm rounded-2xl border border-white/50">
                    <p className="text-xs text-gray-500 mb-2">Miembros</p>
                    <div className="flex items-center">
                      {members.slice(0, 4).map((member, idx) => {
                        const colors = [
                          "from-purple-400 to-purple-600",
                          "from-green-400 to-green-600",
                          "from-orange-400 to-orange-600",
                          "from-blue-400 to-blue-600",
                        ];
                        return (
                          <div
                            key={idx}
                            className={`w-8 h-8 bg-gradient-to-br ${
                              colors[idx % colors.length]
                            } rounded-full border-2 border-white shadow-lg -ml-2 first:ml-0`}
                            title={`${member.slice(0, 6)}...${member.slice(
                              -4
                            )}`}
                          />
                        );
                      })}
                      {members.length > 4 && (
                        <div className="w-8 h-8 bg-gray-200 rounded-full border-2 border-white -ml-2 flex items-center justify-center text-xs text-gray-700 shadow-lg">
                          +{members.length - 4}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-white/60 to-white/40 backdrop-blur-sm rounded-2xl border border-white/50">
                    <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Propuestas
                    </p>
                    <p className="text-xl text-gray-900">
                      {proposalCounter.toString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all flex-shrink-0 ml-4" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function CommunityWallets({
  vaultAddresses,
  onSelectWallet,
}: CommunityWalletsProps) {
  if (vaultAddresses.length === 0) {
    return (
      <Card className="p-12 text-center bg-white/60 backdrop-blur-sm border-2 border-dashed border-gray-300 rounded-3xl">
        <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-bold text-gray-700 mb-2">
          No tienes Coperachas todavía
        </h3>
        <p className="text-gray-500">
          Crea tu primera Coperacha familiar para empezar a ahorrar juntos
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {vaultAddresses.map((address, index) => (
        <CoperachaCard
          key={address}
          vaultAddress={address}
          onSelect={() => onSelectWallet(address)}
          index={index}
        />
      ))}
    </div>
  );
}
