import { useState } from 'react';
import { Button } from './ui/button';
import { Wallet, Users, Plus, LogOut } from 'lucide-react';
import { useWeb3Auth } from './Web3AuthProvider';
import { PersonalWallet } from './PersonalWallet';
import { CommunityWallets } from './CommunityWallets';
import { CreateWalletDialog } from './CreateWalletDialog';
import { WalletDetail } from './WalletDetail';

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
  status: 'active' | 'approved' | 'rejected';
  createdAt: string;
  requiredVotes: number;
}

export interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'proposal';
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
  const { userAddress, logout } = useWeb3Auth();
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [communityWallets, setCommunityWallets] = useState<CommunityWallet[]>([
    {
      id: '1',
      name: 'Familia García',
      description: 'Ahorros para gastos médicos de los abuelos',
      balance: '1250.50',
      members: [
        { address: '0x123...abc', name: 'María García', avatar: 'from-purple-400 to-purple-600' },
        { address: '0x456...def', name: 'Juan García', avatar: 'from-green-400 to-green-600' },
        { address: '0x789...ghi', name: 'Ana García', avatar: 'from-orange-400 to-orange-600' },
        { address: '0xabc...jkl', name: 'Pedro García', avatar: 'from-blue-400 to-blue-600' },
        { address: '0xdef...mno', name: 'Laura García', avatar: 'from-pink-400 to-pink-600' },
      ],
      proposals: [
        {
          id: '1',
          title: 'Medicamentos para los abuelos',
          description: 'Compra de medicamentos mensuales para la presión y diabetes',
          amount: '150.00',
          recipient: '0x123...abc',
          proposedBy: '0x456...def',
          votesFor: ['0x456...def', '0x789...ghi', '0xabc...jkl'],
          votesAgainst: [],
          status: 'approved',
          createdAt: new Date().toISOString(),
          requiredVotes: 3,
        },
        {
          id: '2',
          title: 'Consulta médica',
          description: 'Cita con el cardiólogo para revisión trimestral',
          amount: '200.00',
          recipient: '0x789...ghi',
          proposedBy: '0x123...abc',
          votesFor: ['0x123...abc', '0xdef...mno'],
          votesAgainst: [],
          status: 'active',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          requiredVotes: 3,
        },
      ],
      transactions: [
        {
          id: '1',
          type: 'deposit',
          amount: '250.00',
          from: '0x123...abc',
          description: 'Aporte mensual',
          timestamp: new Date(Date.now() - 172800000).toISOString(),
        },
        {
          id: '2',
          type: 'deposit',
          amount: '250.00',
          from: '0x456...def',
          description: 'Aporte mensual',
          timestamp: new Date(Date.now() - 259200000).toISOString(),
        },
      ],
    },
    {
      id: '2',
      name: 'Ahorro Vacaciones',
      description: 'Para el viaje familiar de fin de año',
      balance: '2840.00',
      members: [
        { address: '0x123...abc', name: 'María García', avatar: 'from-purple-400 to-purple-600' },
        { address: '0x456...def', name: 'Juan García', avatar: 'from-green-400 to-green-600' },
        { address: '0x789...ghi', name: 'Ana García', avatar: 'from-orange-400 to-orange-600' },
      ],
      proposals: [],
      transactions: [],
    },
  ]);

  const handleLogout = () => {
    logout();
    onLogout();
  };

  const handleCreateWallet = (name: string, description: string, memberAddresses: string[]) => {
    const newWallet: CommunityWallet = {
      id: Date.now().toString(),
      name,
      description,
      balance: '0',
      members: memberAddresses.map((addr, idx) => ({
        address: addr,
        name: `Miembro ${idx + 1}`,
        avatar: ['from-purple-400 to-purple-600', 'from-green-400 to-green-600', 'from-orange-400 to-orange-600'][idx % 3],
      })),
      proposals: [],
      transactions: [],
    };
    setCommunityWallets([...communityWallets, newWallet]);
  };

  const handleVote = (walletId: string, proposalId: string, vote: 'for' | 'against') => {
    setCommunityWallets(wallets => 
      wallets.map(wallet => {
        if (wallet.id !== walletId) return wallet;
        
        return {
          ...wallet,
          proposals: wallet.proposals.map(proposal => {
            if (proposal.id !== proposalId) return proposal;
            
            const votesFor = vote === 'for' 
              ? [...proposal.votesFor, userAddress!]
              : proposal.votesFor;
            const votesAgainst = vote === 'against'
              ? [...proposal.votesAgainst, userAddress!]
              : proposal.votesAgainst;
            
            const status = votesFor.length >= proposal.requiredVotes ? 'approved' : 'active';
            
            // Si se aprueba, ejecutar el retiro
            if (status === 'approved' && proposal.status === 'active') {
              const newBalance = (parseFloat(wallet.balance) - parseFloat(proposal.amount)).toFixed(2);
              wallet.balance = newBalance;
              
              wallet.transactions.unshift({
                id: Date.now().toString(),
                type: 'withdrawal',
                amount: proposal.amount,
                from: 'Billetera comunitaria',
                to: proposal.recipient,
                description: proposal.title,
                timestamp: new Date().toISOString(),
              });
            }
            
            return {
              ...proposal,
              votesFor,
              votesAgainst,
              status,
            };
          }),
        };
      })
    );
  };

  const handleCreateProposal = (walletId: string, title: string, description: string, amount: string, recipient: string) => {
    setCommunityWallets(wallets =>
      wallets.map(wallet => {
        if (wallet.id !== walletId) return wallet;
        
        const newProposal: Proposal = {
          id: Date.now().toString(),
          title,
          description,
          amount,
          recipient,
          proposedBy: userAddress!,
          votesFor: [userAddress!],
          votesAgainst: [],
          status: 'active',
          createdAt: new Date().toISOString(),
          requiredVotes: Math.ceil(wallet.members.length / 2),
        };
        
        return {
          ...wallet,
          proposals: [newProposal, ...wallet.proposals],
        };
      })
    );
  };

  const handleDeposit = (walletId: string, amount: string) => {
    setCommunityWallets(wallets =>
      wallets.map(wallet => {
        if (wallet.id !== walletId) return wallet;
        
        const newBalance = (parseFloat(wallet.balance) + parseFloat(amount)).toFixed(2);
        
        return {
          ...wallet,
          balance: newBalance,
          transactions: [
            {
              id: Date.now().toString(),
              type: 'deposit',
              amount,
              from: userAddress!,
              description: 'Depósito a billetera comunitaria',
              timestamp: new Date().toISOString(),
            },
            ...wallet.transactions,
          ],
        };
      })
    );
  };

  const selectedWalletData = communityWallets.find(w => w.id === selectedWallet);

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
                <span className="text-xl bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">cooperacha</span>
                <p className="text-xs text-gray-500">Ahorro familiar Web3</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-3 px-5 py-3 bg-white/80 backdrop-blur-sm rounded-2xl border border-blue-200/50 shadow-lg">
                <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse shadow-lg shadow-green-500/50"></div>
                <span className="text-sm text-gray-700 font-mono">
                  {userAddress?.slice(0, 6)}...{userAddress?.slice(-4)}
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
      {selectedWalletData ? (
        <WalletDetail
          wallet={selectedWalletData}
          userAddress={userAddress!}
          onBack={() => setSelectedWallet(null)}
          onVote={handleVote}
          onCreateProposal={handleCreateProposal}
          onDeposit={handleDeposit}
        />
      ) : (
        <main className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Personal Wallet */}
            <div className="lg:col-span-1">
              <PersonalWallet />
            </div>

            {/* Right Column - Community Wallets */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-gray-900">Billeteras Comunitarias</h2>
                  <p className="font-semibold text-gray-600 mt-1">Gestiona tus ahorros familiares</p>
                </div>
                <CreateWalletDialog onCreateWallet={handleCreateWallet} />
              </div>

              <CommunityWallets
                wallets={communityWallets}
                onSelectWallet={setSelectedWallet}
              />
            </div>
          </div>
        </main>
      )}
    </div>
  );
}