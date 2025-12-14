import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import {
  Wallet,
  ArrowDownToLine,
  ArrowUpFromLine,
  Sparkles,
  TrendingUp,
  Loader2,
} from "lucide-react";
import { useAccount, useBalance } from "wagmi";
import { formatEther, parseEther } from "viem";
import { useEthPrice, formatEthToUSD } from "../hooks/useEthPrice";
import { useUserCoperachas } from "../hooks/useCoperacha";
import { getSupportedChains } from "../contracts/addresses";
import { toast } from "sonner";
import { useState } from "react";

export function PersonalWallet() {
  const { address, chain } = useAccount();
  const [isDepositing, setIsDepositing] = useState(false);
  const { data: balanceData, refetch: refetchBalance } = useBalance({
    address: address,
  });
  const { data: userCoperachas } = useUserCoperachas(address);
  const ethPrice = useEthPrice();

  const balanceInEth = balanceData
    ? parseFloat(formatEther(balanceData.value))
    : 0;

  // Obtener información de las redes soportadas
  const supportedChains = getSupportedChains();
  const currentNetwork =
    supportedChains.find((c) => c.chainId === chain?.id)?.name ||
    chain?.name ||
    "Desconocida";

  const handleDeposit = async () => {
    if (!address || !chain) {
      toast.error("Wallet no conectada");
      return;
    }

    // Solo permitir en Tenderly Virtual Testnet
    if (chain.id !== 73571) {
      toast.error(
        "Esta función solo está disponible en Tenderly Virtual Testnet",
        {
          description: "Por favor cambia a la red Tenderly Virtual Mainnet",
        }
      );
      return;
    }

    setIsDepositing(true);

    try {
      toast.loading("Procesando compra de ETH...", {
        id: "deposit-eth",
        description: "Solicitando fondos de prueba",
      });

      const rpcUrl =
        (import.meta as any).env?.VITE_TENDERLY_RPC_URL ||
        "https://virtual.mainnet.eu.rpc.tenderly.co/90ce4a22-5494-4568-8d4b-a1530aff5790";

      // Obtener balance actual en wei y sumar 1 ETH
      const currentWei = balanceData?.value ?? 0n;
      const newWei = currentWei + parseEther("1");

      const response = await fetch(rpcUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          method: "tenderly_setBalance",
          params: [address, "0x" + newWei.toString(16)],
          id: 1,
        }),
      });

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error.message || "Error al fondear cuenta");
      }

      await refetchBalance();

      toast.success("¡ETH depositado con éxito!", {
        id: "deposit-eth",
        description: "Se ha agregado 1 ETH a tu billetera",
      });
    } catch (error: any) {
      console.error("Error depositing ETH:", error);
      toast.error("Error al depositar ETH", {
        id: "deposit-eth",
        description: error.message || "Intenta de nuevo",
      });
    } finally {
      setIsDepositing(false);
    }
  };

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-3xl blur-xl opacity-20"></div>
      <Card className="relative border-0 bg-white/80 backdrop-blur-xl shadow-2xl shadow-blue-500/20 rounded-3xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-emerald-600/10"></div>

        <CardHeader className="relative">
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold">Billetera Personal</span>
              <div className="flex items-center gap-1 text-xs font-semibold text-blue-600">
                <Sparkles className="w-3 h-3" />
                <span>Tu balance privado</span>
              </div>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent className="relative space-y-6">
          <div className="p-6 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-2xl shadow-xl">
            <p className="text-sm font-semibold text-blue-100 mb-2 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Balance Disponible
            </p>
            <p className="text-4xl font-bold text-white mb-2">
              ${formatEthToUSD(balanceInEth.toString(), ethPrice)}
            </p>
            <p className="text-sm font-semibold text-blue-100">
              {balanceInEth.toFixed(4)} ETH
            </p>
            <div className="mt-3 pt-3 border-t border-blue-400/30 flex items-center justify-between">
              <span className="text-xs text-blue-100 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                Precio ETH
              </span>
              <span className="text-sm font-bold text-white">
                $
                {ethPrice.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={handleDeposit}
              disabled={isDepositing}
              className="gap-2 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white shadow-lg shadow-blue-500/50 hover:shadow-xl transition-all hover:scale-105 rounded-xl py-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDepositing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Procesando...</span>
                </>
              ) : (
                <>
                  <ArrowDownToLine className="w-5 h-5" />
                  <span>Depositar ETH</span>
                </>
              )}
            </Button>
            <Button className="gap-2 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white shadow-lg shadow-blue-500/50 hover:shadow-xl transition-all hover:scale-105 rounded-xl py-6">
              <ArrowUpFromLine className="w-5 h-5" />
              <span>Enviar</span>
            </Button>
          </div>

          <div className="pt-4 border-t border-blue-200/50">
            <p className="text-sm text-gray-500 mb-3">Información</p>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center p-3 bg-white/60 rounded-xl">
                <span className="text-gray-600">Red</span>
                <span className="text-gray-900 flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  {currentNetwork}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white/60 rounded-xl">
                <span className="text-gray-600">Billeteras comunitarias</span>
                <span className="px-3 py-1 bg-gradient-to-r from-blue-500 to-emerald-500 text-white rounded-lg text-xs shadow-lg">
                  {userCoperachas?.length || 0} activas
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
