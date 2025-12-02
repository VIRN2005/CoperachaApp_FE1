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
import { Plus, X, Sparkles, Loader2 } from "lucide-react";
import { useCreateCoperacha } from "../hooks/useCoperacha";
import { useAccount } from "wagmi";
import { toast } from "sonner";
import { isAddress } from "viem";

interface CreateWalletDialogProps {}

export function CreateWalletDialog({}: CreateWalletDialogProps) {
  const { address: userAddress, chain } = useAccount();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [memberInput, setMemberInput] = useState("");
  const [members, setMembers] = useState<string[]>([]);

  const { createCoperacha, isPending, isConfirming, isSuccess, hash, error } =
    useCreateCoperacha();
  const isLoading = isPending || isConfirming;

  // Manejar éxito de la transacción
  useEffect(() => {
    if (isSuccess && hash) {
      toast.success("¡Coperacha creada!", {
        id: "create-tx",
        description: `"${name}" está lista para usar`,
      });

      // Limpiar formulario y cerrar
      setName("");
      setDescription("");
      setMembers([]);
      setOpen(false);
    }
  }, [isSuccess, hash, name]);

  // Manejar errores
  useEffect(() => {
    if (error) {
      console.error("Transaction error:", error);
    }
  }, [error]);

  const handleAddMember = () => {
    const address = memberInput.trim();
    if (!address) return;

    if (!isAddress(address)) {
      toast.error("Dirección inválida", {
        description: "Por favor ingresa una dirección Ethereum válida (0x...)",
      });
      return;
    }

    // Validar si es la dirección del usuario
    if (userAddress && address.toLowerCase() === userAddress.toLowerCase()) {
      toast.error("No puedes agregarte a ti mismo", {
        description: "Tu wallet ya está incluida automáticamente",
      });
      return;
    }

    if (members.includes(address)) {
      toast.error("Miembro duplicado", {
        description: "Esta dirección ya fue agregada",
      });
      return;
    }

    setMembers([...members, address]);
    setMemberInput("");
    toast.success("Miembro agregado", {
      description: `${address.slice(0, 6)}...${address.slice(-4)}`,
    });
  };

  const handleRemoveMember = (address: string) => {
    setMembers(members.filter((m) => m !== address));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || members.length < 1) {
      toast.error("Datos incompletos", {
        description: "Agrega al menos 1 miembro además de ti",
      });
      return;
    }

    // Incluir al usuario actual en la lista de miembros si no está
    const allMembers =
      userAddress && !members.includes(userAddress)
        ? [userAddress, ...members]
        : members;

    console.log("=== CREANDO COPERACHA ===");
    console.log("Nombre:", name);
    console.log("Miembros:", allMembers);
    console.log("Chain:", chain?.id, chain?.name);
    console.log("Usuario:", userAddress);

    toast.loading("Confirma la transacción en tu wallet", {
      id: "create-tx",
    });

    createCoperacha(name, allMembers as `0x${string}`[]);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white gap-2 shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:scale-105 transition-all rounded-xl px-6 py-6">
          <Plus className="w-5 h-5" />
          <span>Nueva Billetera</span>
          <Sparkles className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl bg-white/95 backdrop-blur-xl border-0 shadow-2xl rounded-3xl overflow-visible">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
            Crear Billetera Comunitaria
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div
            className="space-y-6 custom-scrollbar"
            style={{
              maxHeight: "450px",
              overflowY: "auto",
              padding: "24px 8px 24px 4px",
            }}
          >
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-700">
                Nombre de la billetera
              </Label>
              <Input
                id="name"
                placeholder="Ej: Familia García"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border-gray-200 focus:border-blue-500 rounded-xl py-6 text-lg"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-gray-700">
                Descripción
              </Label>
              <Textarea
                id="description"
                placeholder="¿Para qué usarán esta billetera?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="border-gray-200 focus:border-blue-500 rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700">Miembros de la billetera</Label>
              <p className="text-xs text-gray-500 mb-2">
                Agrega al menos 1 miembro más para crear la Coperacha
              </p>
              <div className="flex gap-2">
                <Input
                  placeholder="Dirección Ethereum (0x...)"
                  value={memberInput}
                  onChange={(e) => setMemberInput(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), handleAddMember())
                  }
                  className="border-gray-200 focus:border-blue-500 rounded-xl"
                />
                <Button
                  type="button"
                  onClick={handleAddMember}
                  className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white rounded-xl px-6"
                >
                  Agregar
                </Button>
              </div>

              {/* Lista de miembros con scroll */}
              <div className="mt-4 border border-gray-200 rounded-xl p-2 bg-gray-50/50">
                <div className="space-y-2">
                  {/* Tu wallet (siempre visible, sin botón X) */}
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-200/50">
                    <div className="flex items-center gap-3">
                      <span className="px-2 py-1 bg-purple-500 text-white text-xs rounded-lg font-semibold">
                        Tú
                      </span>
                      <span className="text-sm text-gray-700 font-mono">
                        {userAddress}
                      </span>
                    </div>
                  </div>

                  {/* Miembros agregados (con botón X) */}
                  {members.map((member) => (
                    <div
                      key={member}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-emerald-50 rounded-xl border border-blue-200/50"
                    >
                      <span className="text-sm text-gray-700 font-mono">
                        {member}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveMember(member)}
                        className="hover:bg-white/60 rounded-lg"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Información de votos requeridos */}
              {members.length > 0 && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl mt-4">
                  <p className="text-sm text-blue-900 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    {members.length + 1} miembro
                    {members.length + 1 !== 1 ? "s" : ""} • Se requieren{" "}
                    <strong>
                      {Math.floor((members.length + 1) / 2) + 1} votos
                    </strong>{" "}
                    para aprobar gastos
                  </p>
                </div>
              )}
            </div>
          </div>
          <DialogFooter className="gap-3 pt-4 border-t mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="rounded-xl border-2 border-gray-200 hover:bg-gray-50 px-6"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white shadow-lg shadow-blue-500/30 rounded-xl px-6"
              disabled={!name || members.length < 1 || isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {isConfirming ? "Confirmando..." : "Creando..."}
                </>
              ) : (
                "Crear Billetera"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
