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
import { UserPlus, Loader2 } from "lucide-react";
import { Address, isAddress } from "viem";
import { useProposeAddMember } from "../hooks/useCoperacha";
import { toast } from "sonner";

interface AddMemberProposalDialogProps {
  vaultAddress: Address;
  currentMembers: Address[];
  onSuccess?: () => void;
}

export function AddMemberProposalDialog({
  vaultAddress,
  currentMembers,
  onSuccess,
}: AddMemberProposalDialogProps) {
  const [open, setOpen] = useState(false);
  const [newMemberAddress, setNewMemberAddress] = useState("");
  const [reason, setReason] = useState("");

  const { proposeAddMember, isPending, isConfirming, isSuccess, error } =
    useProposeAddMember(vaultAddress);
  const isLoading = isPending || isConfirming;

  // Manejar estados de la transacción
  useEffect(() => {
    if (isPending) {
      toast.loading("Confirma la transacción en tu wallet...", {
        id: "add-member-tx",
      });
    } else if (isConfirming) {
      toast.loading("Creando propuesta de nuevo miembro...", {
        id: "add-member-tx",
        description: "Esperando confirmación en el blockchain",
      });
    } else if (isSuccess) {
      toast.success("¡Propuesta creada!", {
        id: "add-member-tx",
        description: "La propuesta requiere votación de los miembros",
      });
      setNewMemberAddress("");
      setReason("");
      setOpen(false);
      if (onSuccess) {
        onSuccess();
      }
    }
  }, [isPending, isConfirming, isSuccess, onSuccess]);

  // Manejar errores
  useEffect(() => {
    if (error) {
      toast.dismiss("add-member-tx");

      const errorMessage = error.message || String(error);
      if (
        errorMessage.includes("User rejected") ||
        errorMessage.includes("user rejected")
      ) {
        toast.error("Transacción cancelada", {
          description: "Rechazaste la transacción en tu wallet",
        });
      } else if (errorMessage.includes("Already a member")) {
        toast.error("Miembro duplicado", {
          description: "Esta dirección ya es miembro de la billetera",
        });
      } else {
        toast.error("Error al crear propuesta", {
          description: errorMessage || "Intenta de nuevo",
        });
      }
    }
  }, [error]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones
    if (!newMemberAddress.trim()) {
      toast.error("Dirección requerida", {
        description: "Ingresa la dirección del nuevo miembro",
      });
      return;
    }

    if (!isAddress(newMemberAddress)) {
      toast.error("Dirección inválida", {
        description: "Ingresa una dirección Ethereum válida (0x...)",
      });
      return;
    }

    // Validar que no sea dirección cero
    if (
      newMemberAddress.toLowerCase() ===
      "0x0000000000000000000000000000000000000000"
    ) {
      toast.error("Dirección inválida", {
        description: "No puedes usar la dirección cero",
      });
      return;
    }

    // Validar que no sea miembro actual
    if (
      currentMembers.some(
        (member) => member.toLowerCase() === newMemberAddress.toLowerCase()
      )
    ) {
      toast.error("Miembro duplicado", {
        description: "Esta dirección ya es miembro",
      });
      return;
    }

    // Si no hay razón, usar una por defecto
    const description = reason.trim() || `Propuesta para agregar nuevo miembro`;

    try {
      proposeAddMember(description, newMemberAddress as Address);
    } catch (error: any) {
      toast.error("Error", {
        description: error.message || "Datos inválidos",
      });
    }
  };

  const copyToClipboard = async (address: string) => {
    try {
      await navigator.clipboard.writeText(address);
      toast.success("Dirección copiada");
    } catch {
      toast.error("No se pudo copiar");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white gap-2 shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:scale-105 transition-all rounded-xl px-6 py-6">
          <UserPlus className="w-5 h-5" />
          <span>Agregar Miembro</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white/95 backdrop-blur-xl border-0 shadow-2xl rounded-3xl max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
            Proponer Nuevo Miembro
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {/* Input de dirección */}
            <div className="space-y-2">
              <Label htmlFor="memberAddress" className="font-semibold">
                Dirección del nuevo miembro
              </Label>
              <Input
                id="memberAddress"
                placeholder="0x123456789abcdef..."
                value={newMemberAddress}
                onChange={(e) => setNewMemberAddress(e.target.value)}
                className="font-mono border-gray-200 focus:border-blue-500 rounded-xl text-sm"
                required
                disabled={isLoading}
              />
              <p className="text-xs text-gray-500">Dirección válida</p>
            </div>

            {/* Input de razón */}
            <div className="space-y-2">
              <Label htmlFor="reason" className="font-semibold">
                Razón de la propuesta{" "}
                <span className="text-gray-400">(opcional)</span>
              </Label>
              <Textarea
                id="reason"
                placeholder="Ej: Es el nuevo integrante del grupo familiar..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                className="border-gray-200 focus:border-blue-500 rounded-xl text-sm"
                disabled={isLoading}
              />
              <p className="text-xs text-gray-500">
                Describe por qué deseas agregar a este miembro
              </p>
            </div>

            {/* Info box */}
            <div className="bg-gradient-to-r from-blue-50 to-emerald-50 border border-blue-200 rounded-xl p-4">
              <p className="text-sm text-blue-900">
                <strong>ℹ️ Cómo funciona:</strong> Esta propuesta será sometida
                a votación. Necesita ser aprobada por mayoría de miembros para
                agregarse a la billetera.
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
