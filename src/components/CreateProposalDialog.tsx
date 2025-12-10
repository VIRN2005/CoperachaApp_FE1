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
import { Textarea } from "./ui/textarea";
import { FilePlus, Loader2 } from "lucide-react";
import { Address, parseEther, isAddress } from "viem";
import { useProposeWithdrawal } from "../hooks/useCoperacha";
import { toast } from "sonner";
import { useEthPrice, formatEthToUSD } from "../hooks/useEthPrice";

interface Member {
  address: string;
  name: string;
  avatar: string;
}

interface CreateProposalDialogProps {
  vaultAddress: Address;
  members: Member[];
  onSuccess?: () => void;
}

export function CreateProposalDialog({
  vaultAddress,
  members,
  onSuccess,
}: CreateProposalDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const ethPrice = useEthPrice();

  const { proposeWithdrawal, isPending, isConfirming, isSuccess, error } =
    useProposeWithdrawal();
  const isLoading = isPending || isConfirming;

  // Manejar estados de la transacción
  useEffect(() => {
    if (isPending) {
      toast.loading("Confirma la transacción en tu wallet...", {
        id: "proposal-tx",
      });
    } else if (isConfirming) {
      toast.loading("Creando propuesta...", {
        id: "proposal-tx",
        description: "Esperando confirmación en el blockchain",
      });
    } else if (isSuccess) {
      toast.success("¡Propuesta creada!", {
        id: "proposal-tx",
        description: `"${title}" requiere votación de los miembros`,
      });
      setTitle("");
      setDescription("");
      setAmount("");
      setRecipient("");
      setOpen(false);
      // Refrescar datos del padre
      if (onSuccess) {
        onSuccess();
      }
    }
  }, [isPending, isConfirming, isSuccess, title, onSuccess]);

  // Manejar errores por separado
  useEffect(() => {
    if (error) {
      toast.dismiss("proposal-tx");

      const errorMessage = error.message || String(error);
      if (
        errorMessage.includes("User rejected") ||
        errorMessage.includes("user rejected")
      ) {
        toast.error("Transacción cancelada", {
          description: "Rechazaste la transacción en tu wallet",
        });
      } else {
        toast.error("Error al crear propuesta", {
          description: "Ocurrió un error. Por favor intenta de nuevo.",
        });
      }
    }
  }, [error]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !amount || !recipient) {
      toast.error("Datos incompletos", {
        description: "Completa todos los campos requeridos",
      });
      return;
    }

    if (!isAddress(recipient)) {
      toast.error("Dirección inválida", {
        description: "Ingresa una dirección Ethereum válida",
      });
      return;
    }

    try {
      // Convertir USD a ETH
      const usdAmount = parseFloat(amount);
      const ethAmount = (usdAmount / ethPrice).toFixed(18);
      const amountInWei = parseEther(ethAmount);

      // Combinar título y descripción para enviar al contrato
      const fullDescription = description ? `${title} - ${description}` : title;

      proposeWithdrawal(
        vaultAddress,
        recipient as Address,
        amountInWei,
        fullDescription
      );
    } catch (error: any) {
      toast.error("Error", {
        description: error.message || "Datos inválidos",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white gap-2 shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:scale-105 transition-all rounded-xl px-6 py-6">
          <FilePlus className="w-5 h-5" />
          <span>Nueva Propuesta</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white/95 backdrop-blur-xl border-0 shadow-2xl rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
            Crear Propuesta de Gasto
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                placeholder="Ej: Medicamentos para los abuelos"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border-gray-200 focus:border-blue-500 rounded-xl"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                placeholder="Describe el motivo del gasto..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="border-gray-200 focus:border-blue-500 rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Monto en USD</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  $
                </span>
                <Input
                  id="amount"
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

            <div className="space-y-2">
              <Label htmlFor="recipient">Dirección del Destinatario</Label>
              <Input
                id="recipient"
                placeholder="0x..."
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="font-mono border-gray-200 focus:border-blue-500 rounded-xl"
                required
                disabled={isLoading}
              />
              <p className="text-xs text-gray-500">
                Puedes copiar la dirección de un miembro o ingresar cualquier
                dirección Ethereum
              </p>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-emerald-50 border border-blue-200 rounded-xl p-4">
              <p className="text-sm text-blue-900">
                <strong>Importante:</strong> Esta propuesta requerirá{" "}
                {Math.floor(members.length / 2) + 1} votos a favor para ser
                aprobada y ejecutada automáticamente.
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
                  {isConfirming ? "Confirmando..." : "Creando..."}
                </>
              ) : (
                "Crear Propuesta"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
