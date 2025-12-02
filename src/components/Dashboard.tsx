import { useState } from "react";
import { Button } from "./ui/button";
import { Wallet, Users, Plus, LogOut, AlertCircle } from "lucide-react";
import { useAccount, useDisconnect, useSwitchChain } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { PersonalWallet } from "./PersonalWallet";
import { CommunityWallets } from "./CommunityWallets";
import { CreateWalletDialog } from "./CreateWalletDialog";
import { WalletDetail } from "./WalletDetail";
import { useUserCoperachas } from "../hooks/useCoperacha";
import { Address } from "viem";
import { Alert, AlertDescription } from "./ui/alert";

export interface CommunityWallet {
  id: string;
  name: string;
  description: string;
  balance: string;
  members: Member[];
  proposals: Proposal[];
  transactions: Transaction[];
}

export interface Member {
  address: string;
  name: string;
  avatar: string;
}

export interface Proposal {
  id: string;
  title: string;
  description: string;
  amount: string;
  recipient: string;
  proposedBy: string;
  votesFor: string[];
  votesAgainst: string[];
  status: "active" | "approved" | "rejected";
  createdAt: string;
  requiredVotes: number;
}

export interface Transaction {
  id: string;
  type: "deposit" | "withdrawal" | "proposal";
  amount: string;
  from: string;
  to?: string;
  description: string;
  timestamp: string;
}

interface DashboardProps {
  onLogout: () => void;
}

export function Dashboard({ onLogout }: DashboardProps) {
  const { address, chain } = useAccount();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);

  // Obtener las Coperachas reales del usuario
  const { data: userVaults, isLoading: isLoadingVaults } =
    useUserCoperachas(address);

  // Verificar si está en la red correcta (Hardhat local)
  const isWrongNetwork = chain?.id !== 31337 && chain?.id !== 1337;

  const handleLogout = () => {
    disconnect();
    onLogout();
  };

  const handleSwitchToLocal = () => {
    switchChain({ chainId: 31337 });
  };

  const handleVote = (
    walletId: string,
    proposalId: string,
    vote: "for" | "against"
  ) => {
    // TODO: Usar useVoteOnProposal hook
    console.log("Votar:", { walletId, proposalId, vote });
  };

  const handleCreateProposal = (
    walletId: string,
    title: string,
    description: string,
    amount: string,
    recipient: string
  ) => {
    // TODO: Usar useProposeWithdrawal o useProposeAddMember hooks
    console.log("Crear propuesta:", {
      walletId,
      title,
      description,
      amount,
      recipient,
    });
  };

  const handleDeposit = (walletId: string, amount: string) => {
    // TODO: Usar useDepositToCoperacha hook
    console.log("Depositar:", { walletId, amount });
  };

  // TODO: Obtener datos del wallet seleccionado del contrato
  // const selectedWalletData = ...

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-emerald-50">
      {/* Header */}
      <header className="bg-white/60 backdrop-blur-xl border-b border-white/20 sticky top-0 z-10 shadow-lg shadow-blue-500/5">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/50">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-xl bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                  cooperacha
                </span>
                <p className="text-xs text-gray-500">Ahorro familiar Web3</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-3 px-5 py-3 bg-white/80 backdrop-blur-sm rounded-2xl border border-blue-200/50 shadow-lg">
                <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse shadow-lg shadow-green-500/50"></div>
                <span className="text-sm text-gray-700 font-mono">
                  {address?.slice(0, 6)}...{address?.slice(-4)}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="gap-2 hover:bg-white/60 rounded-xl"
              >
                <LogOut className="w-4 h-4" />
                Salir
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      {selectedWallet ? (
        <WalletDetail
          vaultAddress={selectedWallet as Address}
          onBack={() => setSelectedWallet(null)}
        />
      ) : (
        <main className="max-w-7xl mx-auto px-6 py-8">
          {/* Alerta de red incorrecta */}
          {isWrongNetwork && (
            <Alert className="mb-6 border-2 border-orange-500 bg-orange-50">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              <AlertDescription className="ml-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-orange-900">
                      Red incorrecta detectada
                    </p>
                    <p className="text-sm text-orange-700 mt-1">
                      Estás conectado a{" "}
                      <strong>{chain?.name || "red desconocida"}</strong>. Tus
                      contratos están en Hardhat Local. Cambia de red para usar
                      la app.
                    </p>
                  </div>
                  <Button
                    onClick={handleSwitchToLocal}
                    className="bg-orange-600 hover:bg-orange-700 text-white ml-4"
                  >
                    Cambiar a Hardhat
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Personal Wallet */}
            <div className="lg:col-span-1">
              <PersonalWallet />
            </div>

            {/* Right Column - Community Wallets */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-gray-900">
                    Billeteras Comunitarias
                  </h2>
                  <p className="font-semibold text-gray-600 mt-1">
                    Gestiona tus ahorros familiares
                  </p>
                </div>
                <CreateWalletDialog />
              </div>

              {isLoadingVaults ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">Cargando tus Coperachas...</p>
                </div>
              ) : (
                <CommunityWallets
                  vaultAddresses={userVaults || []}
                  onSelectWallet={setSelectedWallet}
                />
              )}
            </div>
          </div>
        </main>
      )}
    </div>
  );
}
