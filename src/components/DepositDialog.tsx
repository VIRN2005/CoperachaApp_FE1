import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { ArrowDownToLine, Loader2 } from "lucide-react";
import { Address, parseEther } from "viem";
import { useDepositToCoperacha } from "../hooks/useCoperacha";
import { toast } from "sonner";
import { useEthPrice, formatEthToUSD } from "../hooks/useEthPrice";

interface DepositDialogProps {
  vaultAddress: Address;
  onSuccess?: () => void;
}

export function DepositDialog({ vaultAddress, onSuccess }: DepositDialogProps) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const ethPrice = useEthPrice();

  const { deposit, isPending, isConfirming, isSuccess, error } =
    useDepositToCoperacha();
  const isLoading = isPending || isConfirming;

  // Manejar estados de la transacción
  useEffect(() => {
    if (isPending) {
      toast.loading("Confirma la transacción en tu wallet...", {
        id: "deposit-tx",
      });
    } else if (isConfirming) {
      toast.loading("Procesando depósito...", {
        id: "deposit-tx",
        description: "Esperando confirmación en el blockchain",
      });
    } else if (isSuccess) {
      toast.success("¡Depósito exitoso!", {
        id: "deposit-tx",
        description: `$${amount} depositados a la Coperacha`,
      });
      setAmount("");
      setOpen(false);
      // Refrescar datos del padre
      if (onSuccess) {
        onSuccess();
      }
    }
  }, [isPending, isConfirming, isSuccess, amount, onSuccess]);

  // Manejar errores por separado
  useEffect(() => {
    if (error) {
      toast.dismiss("deposit-tx");

      const errorMessage = error.message || String(error);
      if (
        errorMessage.includes("User rejected") ||
        errorMessage.includes("user rejected")
      ) {
        toast.error("Transacción cancelada", {
          description: "Rechazaste la transacción en tu wallet",
        });
      } else {
        toast.error("Error al depositar", {
          description: "Ocurrió un error. Por favor intenta de nuevo.",
        });
      }
    }
  }, [error]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Monto inválido", {
        description: "Ingresa un monto mayor a 0",
      });
      return;
    }

    try {
      // Convertir USD a ETH
      const usdAmount = parseFloat(amount);
      const ethAmount = (usdAmount / ethPrice).toFixed(18);
      const amountInWei = parseEther(ethAmount);
      deposit(vaultAddress, amountInWei);
    } catch (error: any) {
      toast.error("Error", {
        description: error.message || "Monto inválido",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="gap-2 border-gray-300 rounded-xl hover:bg-gray-50"
        >
          <ArrowDownToLine className="w-4 h-4" />
          Depositar
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white/95 backdrop-blur-xl border-0 shadow-2xl rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
            Depositar a Billetera Comunitaria
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="deposit-amount">Monto en USD</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  $
                </span>
                <Input
                  id="deposit-amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-7 border-gray-200 focus:border-blue-500 rounded-xl"
                  required
                  disabled={isLoading}
                />
              </div>
              {amount && parseFloat(amount) > 0 && (
                <p className="text-xs text-gray-500">
                  ≈ {(parseFloat(amount) / ethPrice).toFixed(6)} ETH
                </p>
              )}
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-emerald-50 border border-blue-200 rounded-xl p-4">
              <p className="text-sm text-gray-600">
                Los fondos se transferirán desde tu billetera personal a la
                billetera comunitaria mediante un smart contract.
              </p>
            </div>
          </div>
          <DialogFooter className="gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="rounded-xl"
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white shadow-lg shadow-blue-500/30 rounded-xl"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {isConfirming ? "Confirmando..." : "Depositando..."}
                </>
              ) : (
                "Confirmar Depósito"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
