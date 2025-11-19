import { Card, CardContent } from './ui/card';
import { Users, ChevronRight, TrendingUp, AlertCircle, Sparkles } from 'lucide-react';
import { CommunityWallet } from './Dashboard';

interface CommunityWalletsProps {
  wallets: CommunityWallet[];
  onSelectWallet: (id: string) => void;
}

export function CommunityWallets({ wallets, onSelectWallet }: CommunityWalletsProps) {
  const gradients = [
    'from-blue-500 to-cyan-500',
    'from-cyan-500 to-teal-500',
    'from-teal-500 to-emerald-500',
    'from-emerald-500 to-green-500',
    'from-blue-600 to-emerald-600',
  ];

  return (
    <div className="space-y-4">
      {wallets.map((wallet, index) => {
        const activeProposals = wallet.proposals.filter(p => p.status === 'active').length;
        const gradient = gradients[index % gradients.length];
        
        return (
          <div key={wallet.id} className="relative group">
            <div className={`absolute inset-0 bg-gradient-to-r ${gradient} rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity`}></div>
            <Card
              className="relative border-0 bg-white/80 backdrop-blur-xl hover:bg-white/90 shadow-xl hover:shadow-2xl transition-all cursor-pointer group-hover:scale-[1.02] rounded-3xl overflow-hidden"
              onClick={() => onSelectWallet(wallet.id)}
            >
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient}`}></div>
              
              <CardContent className="p-8">
                <div className="flex items-start justify-between">
                  <div className="flex gap-5 flex-1">
                    <div className={`w-16 h-16 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xl group-hover:scale-110 transition-transform`}>
                      <Users className="w-8 h-8 text-white" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{wallet.name}</h3>
                        {activeProposals > 0 && (
                          <div className="flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs animate-pulse">
                            <AlertCircle className="w-3 h-3" />
                            <span>{activeProposals} pendiente{activeProposals !== 1 ? 's' : ''}</span>
                          </div>
                        )}
                      </div>
                      <p className="text-sm font-semibold text-gray-600 mb-6">{wallet.description}</p>
                      
                      <div className="grid grid-cols-3 gap-6">
                        <div className="p-4 bg-gradient-to-br from-white/60 to-white/40 backdrop-blur-sm rounded-2xl border border-white/50">
                          <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            Balance
                          </p>
                          <p className={`text-xl bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
                            ${wallet.balance}
                          </p>
                        </div>
                        
                        <div className="p-4 bg-gradient-to-br from-white/60 to-white/40 backdrop-blur-sm rounded-2xl border border-white/50">
                          <p className="text-xs text-gray-500 mb-2">Miembros</p>
                          <div className="flex items-center">
                            {wallet.members.slice(0, 4).map((member, idx) => (
                              <div
                                key={idx}
                                className={`w-8 h-8 bg-gradient-to-br ${member.avatar} rounded-full border-2 border-white shadow-lg -ml-2 first:ml-0`}
                                title={member.name}
                              />
                            ))}
                            {wallet.members.length > 4 && (
                              <div className="w-8 h-8 bg-gray-200 rounded-full border-2 border-white -ml-2 flex items-center justify-center text-xs text-gray-700 shadow-lg">
                                +{wallet.members.length - 4}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="p-4 bg-gradient-to-br from-white/60 to-white/40 backdrop-blur-sm rounded-2xl border border-white/50">
                          <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            Actividad
                          </p>
                          <p className="text-xl text-gray-900">
                            {wallet.transactions.length}
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
      })}

      {wallets.length === 0 && (
        <div className="text-center py-20">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-emerald-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Users className="w-10 h-10 text-blue-400" />
          </div>
          <p className="text-xl font-bold text-gray-700 mb-2">No hay billeteras comunitarias</p>
          <p className="text-sm font-semibold text-gray-500">Crea una nueva para comenzar a ahorrar en familia</p>
        </div>
      )}
    </div>
  );
}